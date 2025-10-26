import { Injectable, NotFoundException } from "@nestjs/common";
import { UsersRepository } from "./repositories/users-repository";
import type { UpdateUserDto } from "./dtos/update-user.dto";

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async findAll() {
    return this.usersRepository.findAll();
  }

  async findById(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findById(id); // Check if user exists

    return this.usersRepository.update(id, dto);
  }

  async delete(id: string) {
    await this.findById(id); // Check if user exists

    await this.usersRepository.delete(id);

    return { message: "User deleted successfully" };
  }
}
