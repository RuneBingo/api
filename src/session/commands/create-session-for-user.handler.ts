import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { addWeeks } from 'date-fns';
import { Repository } from 'typeorm';
import { UAParser } from 'ua-parser-js';

import { Session } from '@/session/session.entity';

import { CreateSessionForUserCommand, CreateSessionForUserResult } from './create-session-for-user.command';
import { SessionCreatedEvent } from '../events/session-created.event';

type IPInfoResponse = {
  city: string;
  region: string;
  country: string;
};

@CommandHandler(CreateSessionForUserCommand)
export class CreateSessionForUserHandler {
  constructor(
    private readonly eventBus: EventBus,
    @InjectRepository(Session) private readonly sessionRepository: Repository<Session>,
  ) {}

  async execute(command: CreateSessionForUserCommand): Promise<CreateSessionForUserResult> {
    const { user, method, sessionId, ip, userAgent } = command;

    if (user.isDisabled) {
      throw new UnauthorizedException('User is disabled');
    }

    const { deviceType, os, browser } = this.getUserAgentInfo(userAgent);
    const location = await this.getLocationFromIP(ip);

    let session = new Session();
    session.createdBy = user.id;
    session.userId = user.id;
    session.sessionID = sessionId;
    session.method = method;
    session.ipAddress = ip;
    session.userAgent = userAgent;
    session.deviceType = deviceType;
    session.os = os;
    session.browser = browser;
    session.location = location;
    session.lastSeenAt = new Date();
    session.expiresAt = addWeeks(new Date(), 2);

    session = await this.sessionRepository.save(session);

    await this.eventBus.publish(new SessionCreatedEvent({ sessionId: session.id, requesterId: user.id }));

    return session;
  }

  private getUserAgentInfo(userAgent: string): Pick<Session, 'deviceType' | 'os' | 'browser'> {
    const parser = new UAParser(userAgent);
    const deviceType = parser.getDevice().type || 'desktop';
    const os = parser.getOS().name || 'unknown';
    const browser = parser.getBrowser().name || 'unknown';

    return { deviceType, os, browser };
  }

  private async getLocationFromIP(ip: string) {
    try {
      const response = await fetch(`https://ipinfo.io/${ip}/json`);
      if (!response.ok) {
        return 'Unknown location';
      }

      const data = (await response.json()) as IPInfoResponse;
      const result = [data.city, data.region, data.country].filter(Boolean).join(', ');

      return result || 'Unknown location';
    } catch {
      return 'Unknown location';
    }
  }
}
