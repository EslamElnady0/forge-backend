import {
  ConflictException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, SignupDto } from './dto/signup.dto';
import { Prisma } from '../generated/prisma/client';

export interface UserAuthCredentials {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  hashedRefreshToken: string | null;
}

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(
    dto: SignupDto,
    hashedPassword: string,
  ): Promise<UserAuthCredentials> {
    return this.execute(() =>
      this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          password: hashedPassword,
          role: (dto.role as Role) ?? Role.USER,
        },
      }),
    );
  }

  async findByEmail(email: string): Promise<UserAuthCredentials | null> {
    return this.execute(() =>
      this.prisma.user.findUnique({
        where: { email },
      }),
    );
  }

  async findById(id: number): Promise<UserAuthCredentials | null> {
    return this.execute(() =>
      this.prisma.user.findUnique({
        where: { id },
      }),
    );
  }

  async updateRefreshTokenHash(
    userId: number,
    hashedRefreshToken: string,
  ): Promise<void> {
    await this.execute(() =>
      this.prisma.user.update({
        where: { id: userId },
        data: { hashedRefreshToken },
      }),
    );
  }

  async clearRefreshToken(userId: number): Promise<void> {
    await this.execute(() =>
      this.prisma.user.updateMany({
        where: { id: userId, hashedRefreshToken: { not: null } },
        data: { hashedRefreshToken: null },
      }),
    );
  }

  private async execute<T>(action: () => Promise<T>): Promise<T> {
    try {
      return await action();
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientInitializationError ||
        error instanceof Prisma.PrismaClientRustPanicError
      ) {
        throw new ServiceUnavailableException(
          'Database service is currently unreachable.',
        );
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Email already in use.');
        }
        if (error.code === 'P2025') {
          throw new NotFoundException('User record not found.');
        }
      }

      throw error;
    }
  }
}
