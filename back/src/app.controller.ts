import { Body, Controller, Get, Post } from "@nestjs/common";
import { PrismaService } from "./database/prisma.service";
import { randomUUID } from "node:crypto";
import type { CreateTeamMemberBody } from "./dtos/create-team-member-body";
import { MembersRepository } from "./repositories/members-repository";

@Controller("app")
export class AppController {
  constructor(private membersRepository: MembersRepository) {}

  @Post("hello")
  async getHello(@Body() body: CreateTeamMemberBody) {
    const { name, function: userFunction } = body;

    await this.membersRepository.create(name, userFunction);
  }
}
