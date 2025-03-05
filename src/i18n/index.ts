import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';

import { SessionLanguageResolver } from './session-language.resolver';

export const i18nModule = I18nModule.forRoot({
  fallbackLanguage: 'en',
  loaderOptions: {
    path: __dirname,
    watch: true,
  },
  typesOutputPath: 'src/i18n/types.ts',
  resolvers: [SessionLanguageResolver, AcceptLanguageResolver],
});
