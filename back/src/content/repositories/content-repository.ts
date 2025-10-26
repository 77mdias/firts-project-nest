import type { Content, ContentStatus } from "@prisma/client";

export interface CreateContentData {
  title: string;
  slug: string;
  body: string;
  excerpt?: string;
  status: ContentStatus;
  authorId: string;
  categoryId?: string;
}

export interface UpdateContentData {
  title?: string;
  slug?: string;
  body?: string;
  excerpt?: string;
  status?: ContentStatus;
  categoryId?: string;
  publishedAt?: Date;
}

export interface FindManyOptions {
  status?: ContentStatus;
  authorId?: string;
  categoryId?: string;
  skip?: number;
  take?: number;
}

export abstract class ContentRepository {
  abstract create(data: CreateContentData): Promise<Content>;
  abstract findById(id: string): Promise<Content | null>;
  abstract findBySlug(slug: string): Promise<Content | null>;
  abstract findMany(options?: FindManyOptions): Promise<Content[]>;
  abstract update(id: string, data: UpdateContentData): Promise<Content>;
  abstract delete(id: string): Promise<void>;
  abstract count(options?: FindManyOptions): Promise<number>;
}
