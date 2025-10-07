import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  // 🧾 Registrar usuario nuevo
  async register(data: RegisterDto) {
    const exists = await this.prisma.miembro.findUnique({
      where: { correo: data.correo },
    });
    if (exists) throw new ConflictException('El correo ya está registrado');

    const hashed = await bcrypt.hash(data.contrasena, 10);

    const user = await this.prisma.miembro.create({
      data: {
        nombre: data.nombre,
        apellido: data.apellido,
        correo: data.correo,
        contrasena: hashed,
        tipo_usuario: 'estudiante',
      },
    });

    return this.signToken(user.id_usuario, user.correo);
  }

  // 🔐 Login
  async login(data: LoginDto) {
    const user = await this.prisma.miembro.findUnique({
      where: { correo: data.correo },
    });

    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const valid = await bcrypt.compare(data.contrasena, user.contrasena);
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');

    return this.signToken(user.id_usuario, user.correo);
  }

  // 🎟️ Generar token JWT
  async signToken(id: number, correo: string) {
    const payload = { sub: id, correo };
    const token = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '7d',
    });
    return { access_token: token };
  }

  // 👤 Obtener datos del usuario autenticado
  async profile(userId: number) {
    return this.prisma.miembro.findUnique({
      where: { id_usuario: userId },
      select: { id_usuario: true, nombre: true, apellido: true, correo: true, tipo_usuario: true },
    });
  }
}
