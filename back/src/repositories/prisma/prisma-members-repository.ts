import { PrismaService } from "src/database/prisma.service";
import type { MembersRepository } from "../members-repository";
import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaMembersRepository implements MembersRepository {
  constructor(private prisma: PrismaService) {}

  async create(name: string, userFunction: string): Promise<void> {
    await this.prisma.memberUserStack.create({
      data: {
        id: randomUUID(),
        name,
        function: userFunction,
      },
    });
  }
}
