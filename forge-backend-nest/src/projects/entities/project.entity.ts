export class Project {
  constructor(
    public readonly id: number,
    public title: string,
    public description: string | null,
    public ownerId: number,
    public members?: ProjectMember[],
  ) {}
}

export class ProjectMember {
  constructor(
    public readonly id: number,
    public name: string,
    public email: string,
  ) {}
}
