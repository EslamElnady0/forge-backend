import { User } from "./user";
import { UserRepository } from "./user.repository";
import { Validator } from "../validator";
import { AppError } from "../utils/appError";

export class UserService {
  constructor(private userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  createUser(name: string, email: string): User {
    const user: User = new User(name, email);
    return this.userRepository.save(user);
  }
  getUser(id: number): User {
    const foundUser = this.userRepository.findById(id);

    if (foundUser == null) {
      throw new AppError("User not found", 404);
    }

    return foundUser;
  }

  getUsers(): User[] {
    return this.userRepository.fetchUsers();
  }
}
