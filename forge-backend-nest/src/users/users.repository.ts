import {
  ConflictException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Prisma } from '../generated/prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<User> {
    const raw = await this.execute(() =>
      this.prisma.user.findUniqueOrThrow({ where: { id } }),
    );
    return new User(raw.id, raw.name, raw.email);
  }

  async fetchUsers(): Promise<User[]> {
    const rawUsers = await this.execute(() => this.prisma.user.findMany());
    return rawUsers.map((user) => new User(user.id, user.name, user.email));
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const raw = await this.execute(() =>
      this.prisma.user.update({
        where: { id },
        data: dto,
      }),
    );
    return new User(raw.id, raw.name, raw.email);
  }

  async delete(id: number): Promise<User> {
    const raw = await this.execute(() =>
      this.prisma.user.delete({
        where: { id },
      }),
    );
    return new User(raw.id, raw.name, raw.email);
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
        switch (error.code) {
          case 'P2002':
            throw new ConflictException('This email is already in use.');
          case 'P2025':
            throw new NotFoundException('User not found.');
        }
      }

      throw error;
    }
  }
}
