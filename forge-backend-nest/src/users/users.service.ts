import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    return this.userRepository.save(dto);
  }

  async getUser(id: number): Promise<User> {
    return this.userRepository.findById(id);
  }

  async getUsers(): Promise<User[]> {
    return this.userRepository.fetchUsers();
  }

  async updateUser(id: number, dto: UpdateUserDto): Promise<User> {
    return this.userRepository.update(id, dto);
  }

  async deleteUser(id: number): Promise<User> {
    return this.userRepository.delete(id);
  }
}
