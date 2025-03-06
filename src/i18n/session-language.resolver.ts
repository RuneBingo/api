import { Injectable, ExecutionContext } from '@nestjs/common';
import { I18nResolver } from 'nestjs-i18n';

@Injectable()
export class SessionLanguageResolver implements I18nResolver {
  resolve(context: ExecutionContext) {
    // For now, we only support HTTP requests
    if (context.getType() !== 'http') return undefined;

    const request = context.switchToHttp().getRequest<Request>();

    return request.session?.language;
  }
}
