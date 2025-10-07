import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}
  @Get()
  async ok() {
    const admins = await this.prisma.administrador.count();
    return { status: 'ok', mysqlAdmins: admins };
  }
}
