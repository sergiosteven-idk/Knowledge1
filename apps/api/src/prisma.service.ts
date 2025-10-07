import { Injectable, OnModuleInit } from '@nestjs/common';
// 👇 Importa el cliente EXACTAMENTE desde donde Prisma lo generó:
import { PrismaClient } from '../generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    // Conecta Prisma al iniciar NestJS
    await this.$connect();
  }
}
