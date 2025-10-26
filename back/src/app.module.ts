import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { PrismaService } from "./database/prisma.service";
import { PrismaMembersRepository } from "./repositories/prisma/prisma-members-repository";
import { MembersRepository } from "./repositories/members-repository";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ContentModule } from "./content/content.module";

@Module({
  imports: [AuthModule, UsersModule, ContentModule],
  controllers: [AppController],
  providers: [
    PrismaService,
    { provide: MembersRepository, useClass: PrismaMembersRepository },
  ],
})
export class AppModule {}
