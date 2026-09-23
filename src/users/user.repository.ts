import { User } from "./user";

type NullableUser = User | undefined;

let users: User[] = [];

export class UserRepository {
  save(user: User): User {
    users.push(user);
    return user;
  }

  findById(id: number): NullableUser {
    let user = users.find((user) => {
      return user.id === id;
    });

    return user;
  }

  fetchUsers(): User[] {
    return users;
  }
}
