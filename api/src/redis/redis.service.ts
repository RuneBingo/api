import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

import { type AppConfig } from '../config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;

  constructor(private readonly configService: ConfigService<AppConfig>) {
    this.client = createClient({
      socket: {
        host: this.configService.getOrThrow('REDIS_URL', { infer: true }),
        port: this.configService.getOrThrow('REDIS_PORT', { infer: true }),
      },
      password: this.configService.getOrThrow('REDIS_PASSWORD', { infer: true }),
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

  /** Sets a key-value pair in Redis. If `ttl` is provided, the key will expire after `ttl` seconds. */
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
