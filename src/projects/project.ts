export class Project {
  constructor(
    public readonly id: number,
    public title: string,
    public description: string | null,
    public ownerId: number,
  ) {}
}

export class CreateProjectRequest {
  constructor(
    public title: string,
    public description: string | undefined,
    public ownerId: number,
  ) {}
}
