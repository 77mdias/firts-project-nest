import type { Role, User } from "@prisma/client";

export type UserWithoutPassword = Omit<User, "password">;

export interface UpdateUserData {
  name?: string;
  role?: Role;
  isActive?: boolean;
}

export abstract class UsersRepository {
  abstract findById(id: string): Promise<UserWithoutPassword | null>;
  abstract findByEmail(email: string): Promise<UserWithoutPassword | null>;
  abstract findAll(): Promise<UserWithoutPassword[]>;
  abstract update(id: string, data: UpdateUserData): Promise<UserWithoutPassword>;
  abstract delete(id: string): Promise<void>;
}
