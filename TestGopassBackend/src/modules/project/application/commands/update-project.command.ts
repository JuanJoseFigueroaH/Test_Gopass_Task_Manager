export class UpdateProjectCommand {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly description?: string,
    public readonly isActive?: boolean,
  ) {}
}
