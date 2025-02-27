import { Body, Controller, HttpCode, Post, UnauthorizedException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { SignInWithEmailCommand } from './commands/sign-in-with-email.command';
import { SignInWithEmailDto } from './dto/sign-in-with-email.dto';
import { VerifyEmailCodeDto } from './dto/verify-email-code.dto';
import { VerifyEmailCode } from './queries/verify-email-code.query';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('email/sign-in')
  @ApiOperation({ summary: 'Request authentication code via email' })
  @HttpCode(201)
  @ApiResponse({ status: 201, description: 'An email with an authentication code has been sent.' })
  async signInWithEmail(@Body() body: SignInWithEmailDto) {
    await this.commandBus.execute(new SignInWithEmailCommand(body.email));
  }

  @Post('email/verify-code')
  @ApiOperation({ summary: 'Verify email authentication code' })
  @ApiResponse({ status: 201, description: 'Signed in successfully.' })
  @ApiUnauthorizedResponse({ description: 'The code is invalid or has expired.' })
  async verifyEmailCode(@Body() body: VerifyEmailCodeDto) {
    const { email, code } = body;

    const valid = await this.queryBus.execute(new VerifyEmailCode(email, code));
    if (!valid) {
      throw new UnauthorizedException('The code is invalid or has expired.');
    }

    // TODO: create User if not exists
    // TODO: create session
  }
}
