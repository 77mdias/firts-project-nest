import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import type {
  CreateContentData,
  UpdateContentData,
  FindManyOptions,
} from "../content-repository";
import { ContentRepository } from "../content-repository";
import { ContentStatus } from "@prisma/client";

@Injectable()
export class PrismaContentRepository implements ContentRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateContentData) {
    const contentData: any = {
      ...data,
    };

    // Set publishedAt if status is PUBLISHED
    if (data.status === ContentStatus.PUBLISHED) {
      contentData.publishedAt = new Date();
    }

    return this.prisma.content.create({
      data: contentData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.content.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        category: true,
      },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.content.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
      },
    });
  }

  async findMany(options?: FindManyOptions) {
    const where: any = {};

    if (options?.status) {
      where.status = options.status;
    }

    if (options?.authorId) {
      where.authorId = options.authorId;
    }

    if (options?.categoryId) {
      where.categoryId = options.categoryId;
    }

    return this.prisma.content.findMany({
      where,
      skip: options?.skip,
      take: options?.take,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async update(id: string, data: UpdateContentData) {
    const updateData: any = { ...data };

    // Set publishedAt if status changes to PUBLISHED
    if (data.status === ContentStatus.PUBLISHED && !data.publishedAt) {
      updateData.publishedAt = new Date();
    }

    return this.prisma.content.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
      },
    });
  }

  async delete(id: string) {
    await this.prisma.content.delete({
      where: { id },
    });
  }

  async count(options?: FindManyOptions) {
    const where: any = {};

    if (options?.status) {
      where.status = options.status;
    }

    if (options?.authorId) {
      where.authorId = options.authorId;
    }

    if (options?.categoryId) {
      where.categoryId = options.categoryId;
    }

    return this.prisma.content.count({ where });
  }
}
