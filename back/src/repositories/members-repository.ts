export abstract class MembersRepository {
  abstract create(name: string, userFunction: string): Promise<void>;
}
