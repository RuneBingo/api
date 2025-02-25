import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

export const entities = [];

export const migrations = [__dirname + '/migrations/**/*.ts', __dirname + '/migrations/**/*.js'];

export const subscribers = [__dirname + '/subscribers/**/*.ts', __dirname + '/subscribers/**/*.js'];

export default TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const env = configService.get<string>('NODE_ENV') || 'development';
    const isTest = env === 'test';
    const isProduction = env === 'production';

    return {
      type: 'postgres',
      host: process.env.POSTGRES_URL,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: isTest ? process.env.POSTGRES_TEST_DB : process.env.POSTGRES_DB,
      synchronize: isTest,
      dropSchema: isTest,
      logging: !isProduction,
      logger: 'file',
      entities,
      subscribers: isTest ? [] : subscribers,
      migrations,
    };
  },
});
