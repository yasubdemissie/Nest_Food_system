import 'dotenv/config';
import { env } from 'prisma/config';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/client';
// import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

@Injectable()
export class prismaService extends PrismaClient {
  constructor() {
    // const adapter = new PrismaPg({
    //   url: env('DATABASE_URL'),
    // });
    const adapter = new PrismaBetterSqlite3({
      url: env('DATABASE_URL'),
    });

    super({ adapter });

    this.$connect()
      .then(() => console.log('✅ Prisma connected to database'))
      .catch((e) => console.error('❌ Prisma connection error', e));
  }
}
