import { Task } from "./task";

type NullableTask = Task | undefined;

let tasks: Task[] = [];

export class TaskRepository {
  save(task: Task): Task {
    tasks.push(task);
    return task;
  }

  findById(id: number): NullableTask {
    return tasks.find((t) => t.id === id);
  }

  fetchTasks(): Task[] {
    return tasks;
  }

  findByProjectId(projectId: number): Task[] {
    return tasks.filter((t) => t.projectId === projectId);
  }

  findByAssigneeId(assigneeId: number): Task[] {
    return tasks.filter((t) => t.assigneeId === assigneeId);
  }
}
