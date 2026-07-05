import { defineConfig } from 'prisma/config';

export default defineConfig({
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: "postgresql://neondb_owner:npg_GeN1YPfCwcp7@ep-fancy-bird-atjt2434-pooler.c-9.us-east-1.aws.neon.tech/yalla?sslmode=require",
  },
});