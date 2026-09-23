export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export class Task {
  private static totalCount: number = 0;
  public readonly id: number;

  constructor(
    public title: string,
    public status: TaskStatus,
    public projectId: number,
    public assigneeId: number,
  ) {
    this.id = Task.totalCount;
    Task.totalCount++;
  }
}
