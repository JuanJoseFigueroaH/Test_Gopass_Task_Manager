export class CreateProjectCommand {
  constructor(
    public readonly name: string,
    public readonly description: string | undefined,
    public readonly userId: string,
  ) {}
}
