import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;

  constructor(private readonly configService: ConfigService) {
    this.client = createClient({
      socket: {
        host: this.configService.get<string>('REDIS_URL', 'localhost'),
        port: this.configService.get<number>('REDIS_PORT', 6379),
      },
      password: this.configService.get<string>('REDIS_PASSWORD', '') || undefined,
    });

    this.client.on('error', (err) => console.error('Redis Client Error:', err));
  }

  async onModuleInit() {
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.disconnect();
  }

  getClient(): RedisClientType {
    return this.client;
  }

  async set(key: string, value: string, ttl?: number) {
    await this.client.set(key, value, { EX: ttl });
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async delete(key: string) {
    await this.client.del(key);
  }
}
