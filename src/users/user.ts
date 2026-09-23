export class User {
  private static totalUsersCount: number = 0;
  public readonly id: number;

  constructor(
    public name: string,
    public email: string,
  ) {
    this.id = User.totalUsersCount;
    console.log(`created user with id ${User.totalUsersCount}`);

    User.totalUsersCount++;
  }
}
