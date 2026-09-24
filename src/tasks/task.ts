export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export class Task {
  constructor(
    public readonly id: number,
    public title: string,
    public status: TaskStatus,
    public projectId: number,
    public assigneeId: number | null,
  ) {}
}

export class CreateTaskRequest {
  constructor(
    public title: string,
    public status: TaskStatus,
    public projectId: number,
    public assigneeId: number | undefined,
  ) {}
}
