import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ContentService } from "./content.service";
import { CreateContentDto } from "./dtos/create-content.dto";
import { UpdateContentDto } from "./dtos/update-content.dto";
import { QueryContentDto } from "./dtos/query-content.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import type { CurrentUserData } from "src/auth/decorators/current-user.decorator";
import { Role } from "@prisma/client";

@Controller("content")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ContentController {
  constructor(private contentService: ContentService) {}

  @Post()
  @Roles(Role.ADMIN, Role.EDITOR)
  async create(
    @Body() dto: CreateContentDto,
    @CurrentUser() user: CurrentUserData
  ) {
    return this.contentService.create(dto, user.id);
  }

  @Get()
  @Roles(Role.ADMIN, Role.EDITOR, Role.VIEWER)
  async findAll(
    @Query() query: QueryContentDto,
    @CurrentUser() user: CurrentUserData
  ) {
    return this.contentService.findAll(query, user.id, user.role as Role);
  }

  @Get("slug/:slug")
  @Roles(Role.ADMIN, Role.EDITOR, Role.VIEWER)
  async findBySlug(
    @Param("slug") slug: string,
    @CurrentUser() user: CurrentUserData
  ) {
    return this.contentService.findBySlug(slug, user.id, user.role as Role);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.EDITOR, Role.VIEWER)
  async findById(
    @Param("id") id: string,
    @CurrentUser() user: CurrentUserData
  ) {
    return this.contentService.findById(id, user.id, user.role as Role);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.EDITOR)
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateContentDto,
    @CurrentUser() user: CurrentUserData
  ) {
    return this.contentService.update(id, dto, user.id, user.role as Role);
  }

  @Delete(":id")
  @Roles(Role.ADMIN, Role.EDITOR)
  async delete(@Param("id") id: string, @CurrentUser() user: CurrentUserData) {
    return this.contentService.delete(id, user.id, user.role as Role);
  }
}
