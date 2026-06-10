export class TaskDeletedEvent {
  constructor(
    public readonly taskId: string,
    public readonly projectId: string,
  ) {}
}
