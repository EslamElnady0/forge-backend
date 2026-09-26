import { CreateUserRequest, User } from "./user";
import { UserRepository } from "./user.repository";
import { AppError } from "../utils/appError";

export class UserService {
  constructor(private userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async createUser(name: string, email: string): Promise<User> {
    const user: CreateUserRequest = new CreateUserRequest(name, email);
    return await this.userRepository.save(user);
  }
  async getUser(id: number): Promise<User> {
    const foundUser = await this.userRepository.findById(id);

    if (foundUser == null) {
      throw new AppError("User not found", 404);
    }

    return foundUser;
  }

  async getUsers(): Promise<User[]> {
    return await this.userRepository.fetchUsers();
  }
}
