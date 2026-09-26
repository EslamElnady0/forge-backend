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

export class addMemberToProjectResponse {
  constructor(public message: string) {}
}

export class ProjectMemberResponse {
  constructor(
    public id: number,
    public name: string,
    public email: string,
  ) {}
}
