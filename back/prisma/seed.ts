import { PrismaClient, Role, ContentStatus } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Create Admin User
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: adminPassword,
      name: "Admin User",
      role: Role.ADMIN,
    },
  });

  console.log("Admin user created:", admin.email);

  // Create Editor User
  const editorPassword = await bcrypt.hash("editor123", 10);
  const editor = await prisma.user.upsert({
    where: { email: "editor@example.com" },
    update: {},
    create: {
      email: "editor@example.com",
      password: editorPassword,
      name: "Editor User",
      role: Role.EDITOR,
    },
  });

  console.log("Editor user created:", editor.email);

  // Create Viewer User
  const viewerPassword = await bcrypt.hash("viewer123", 10);
  const viewer = await prisma.user.upsert({
    where: { email: "viewer@example.com" },
    update: {},
    create: {
      email: "viewer@example.com",
      password: viewerPassword,
      name: "Viewer User",
      role: Role.VIEWER,
    },
  });

  console.log("Viewer user created:", viewer.email);

  // Create Categories
  const techCategory = await prisma.category.upsert({
    where: { slug: "technology" },
    update: {},
    create: {
      name: "Technology",
      slug: "technology",
      description: "Articles about technology and programming",
    },
  });

  const businessCategory = await prisma.category.upsert({
    where: { slug: "business" },
    update: {},
    create: {
      name: "Business",
      slug: "business",
      description: "Business insights and strategies",
    },
  });

  console.log("Categories created");

  // Create Sample Content
  await prisma.content.upsert({
    where: { slug: "welcome-to-the-platform" },
    update: {},
    create: {
      title: "Welcome to the Platform",
      slug: "welcome-to-the-platform",
      body: "This is a sample published article. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      excerpt: "A warm welcome to our content platform",
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: techCategory.id,
    },
  });

  await prisma.content.upsert({
    where: { slug: "getting-started-guide" },
    update: {},
    create: {
      title: "Getting Started Guide",
      slug: "getting-started-guide",
      body: "This is a draft article by the editor. Only admins and the author can see this.",
      excerpt: "Learn how to get started with our platform",
      status: ContentStatus.DRAFT,
      authorId: editor.id,
      categoryId: techCategory.id,
    },
  });

  console.log("Sample content created");
  console.log("\nDefault users:");
  console.log("Admin: admin@example.com / admin123");
  console.log("Editor: editor@example.com / editor123");
  console.log("Viewer: viewer@example.com / viewer123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
