import { Module } from "@nestjs/common";
import { ContentController } from "./content.controller";
import { ContentService } from "./content.service";
import { ContentRepository } from "./repositories/content-repository";
import { PrismaContentRepository } from "./repositories/prisma/prisma-content-repository";
import { PrismaService } from "src/database/prisma.service";

@Module({
  controllers: [ContentController],
  providers: [
    ContentService,
    PrismaService,
    { provide: ContentRepository, useClass: PrismaContentRepository },
  ],
  exports: [ContentService],
})
export class ContentModule {}
