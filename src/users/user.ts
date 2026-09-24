export class User {
  constructor(
    public readonly id: number,
    public name: string,
    public email: string,
  ) {}
}

export class CreateUserRequest {
  constructor(
    public name: string,
    public email: string,
  ) {}
}
