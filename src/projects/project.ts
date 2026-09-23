export class Project {
  private static totalCount: number = 0;
  public readonly id: number;
  constructor(
    public title: string,
    public description: string,
    public ownerId: number,
  ) {
    this.id = Project.totalCount;
    Project.totalCount++;
  }
}
