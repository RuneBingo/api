import { Body, Controller, HttpCode, Logger, Post, Request, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

import type { ApiRequest } from '@/extensions/express.extensions';
import { CreateSessionForUserCommand } from '@/session/commands/create-session-for-user.command';
import { SignOutSessionByUuidCommand } from '@/session/commands/sign-out-session-by-uuid.command';
import type { SessionMethod } from '@/session/session.entity';
import { CreateUserCommand } from '@/user/commands/create-user.command';
import { FindUserByEmailQuery } from '@/user/queries/find-user-by-email.query';
import type { User } from '@/user/user.entity';

import { SignInWithEmailCommand } from './commands/sign-in-with-email.command';
import { SignInWithEmailDto } from './dto/sign-in-with-email.dto';
import { VerifyEmailCodeDto } from './dto/verify-email-code.dto';
import { VerifyEmailCodeQuery } from './queries/verify-email-code.query';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('sign-out')
  @ApiOperation({ summary: 'Sign out from current session' })
  @ApiResponse({ status: 201, description: 'Signed out successfully.' })
  @HttpCode(201)
  async signOut(@Request() req: ApiRequest) {
    const { uuid } = req.session;
    if (!uuid) return;

    await this.commandBus.execute(new SignOutSessionByUuidCommand({ uuid, requester: 'self' }));

    req.session.destroy((err: unknown) => {
      if (err) this.logger.error(err);
    });
  }

  @Post('email/sign-in')
  @ApiOperation({ summary: 'Request authentication code via email' })
  @ApiResponse({ status: 201, description: 'An email with an authentication code has been sent.' })
  @HttpCode(201)
  async signInWithEmail(@Body() body: SignInWithEmailDto) {
    const { code } = await this.commandBus.execute(new SignInWithEmailCommand(body.email));

    if (this.configService.get('NODE_ENV') === 'development') {
      this.logger.log(`Generated code ${code} for email ${body.email}`);
    }
  }

  @Post('email/verify-code')
  @ApiOperation({ summary: 'Verify email authentication code' })
  @ApiResponse({ status: 201, description: 'Signed in successfully.' })
  @ApiUnauthorizedResponse({ description: 'The code is invalid or has expired.' })
  async verifyEmailCode(@Body() body: VerifyEmailCodeDto, @Request() req: ApiRequest) {
    const { email, code } = body;

    const { valid } = await this.queryBus.execute(new VerifyEmailCodeQuery(email, code));
    if (!valid) {
      throw new UnauthorizedException('The code is invalid or has expired.');
    }

    let user = await this.queryBus.execute(new FindUserByEmailQuery({ email, withDeleted: true }));
    if (!user) {
      user = await this.commandBus.execute(new CreateUserCommand({ email, emailVerified: true, requester: 'self' }));
    }

    if (user.isDeleted) {
      throw new UnauthorizedException('Your account has been deleted, please contact the support to recover it.');
    }

    await this.createSessionForUser(req, user, 'email');
  }

  private async createSessionForUser(@Request() req: ApiRequest, user: User, method: SessionMethod) {
    const { headers, ip, session } = req;

    if (session.uuid) {
      await this.commandBus.execute(new SignOutSessionByUuidCommand({ uuid: session.uuid, requester: user }));
    }

    const sessionEntity = await this.commandBus.execute(
      new CreateSessionForUserCommand({
        user,
        method,
        ip: ip || 'unknown',
        sessionId: session.id,
        userAgent: headers['user-agent'] || 'unknown',
      }),
    );

    session.uuid = sessionEntity.uuid;
    session.save();
  }
}
