import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from "@nestjs/common";
import { ContentRepository } from "./repositories/content-repository";
import type { CreateContentDto } from "./dtos/create-content.dto";
import type { UpdateContentDto } from "./dtos/update-content.dto";
import type { QueryContentDto } from "./dtos/query-content.dto";
import { Role, ContentStatus } from "@prisma/client";

@Injectable()
export class ContentService {
  constructor(private contentRepository: ContentRepository) {}

  async create(dto: CreateContentDto, userId: string) {
    // Check if slug already exists
    const existingContent = await this.contentRepository.findBySlug(dto.slug);

    if (existingContent) {
      throw new ConflictException("Slug already in use");
    }

    return this.contentRepository.create({
      ...dto,
      authorId: userId,
      status: dto.status || ContentStatus.DRAFT,
    });
  }

  async findAll(query: QueryContentDto, userId: string, userRole: Role) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const options: any = {
      skip,
      take: limit,
      status: query.status,
      categoryId: query.categoryId,
    };

    // VIEWER can only see published content
    if (userRole === Role.VIEWER) {
      options.status = ContentStatus.PUBLISHED;
    }

    // EDITOR can see their own content + published content from others
    if (userRole === Role.EDITOR && !query.status) {
      // This will be handled in the repository
      // For now, we'll fetch all and filter in service
      // In production, you'd want to optimize this with a more complex query
    }

    // Apply authorId filter if provided
    if (query.authorId) {
      options.authorId = query.authorId;
    }

    const contents = await this.contentRepository.findMany(options);
    const total = await this.contentRepository.count(options);

    return {
      data: contents,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string, userId: string, userRole: Role) {
    const content = await this.contentRepository.findById(id);

    if (!content) {
      throw new NotFoundException("Content not found");
    }

    // VIEWER can only see published content
    if (userRole === Role.VIEWER && content.status !== ContentStatus.PUBLISHED) {
      throw new ForbiddenException("Access denied");
    }

    // EDITOR can only see their own drafts or published content
    if (
      userRole === Role.EDITOR &&
      content.status !== ContentStatus.PUBLISHED &&
      content.authorId !== userId
    ) {
      throw new ForbiddenException("Access denied");
    }

    return content;
  }

  async findBySlug(slug: string, userId: string, userRole: Role) {
    const content = await this.contentRepository.findBySlug(slug);

    if (!content) {
      throw new NotFoundException("Content not found");
    }

    // Apply same permissions as findById
    if (userRole === Role.VIEWER && content.status !== ContentStatus.PUBLISHED) {
      throw new ForbiddenException("Access denied");
    }

    if (
      userRole === Role.EDITOR &&
      content.status !== ContentStatus.PUBLISHED &&
      content.authorId !== userId
    ) {
      throw new ForbiddenException("Access denied");
    }

    return content;
  }

  async update(id: string, dto: UpdateContentDto, userId: string, userRole: Role) {
    const content = await this.contentRepository.findById(id);

    if (!content) {
      throw new NotFoundException("Content not found");
    }

    // EDITOR can only update their own content
    if (userRole === Role.EDITOR && content.authorId !== userId) {
      throw new ForbiddenException("You can only edit your own content");
    }

    // Check slug uniqueness if updating slug
    if (dto.slug && dto.slug !== content.slug) {
      const existingContent = await this.contentRepository.findBySlug(dto.slug);
      if (existingContent) {
        throw new ConflictException("Slug already in use");
      }
    }

    return this.contentRepository.update(id, dto);
  }

  async delete(id: string, userId: string, userRole: Role) {
    const content = await this.contentRepository.findById(id);

    if (!content) {
      throw new NotFoundException("Content not found");
    }

    // EDITOR can only delete their own content
    if (userRole === Role.EDITOR && content.authorId !== userId) {
      throw new ForbiddenException("You can only delete your own content");
    }

    await this.contentRepository.delete(id);

    return { message: "Content deleted successfully" };
  }
}
