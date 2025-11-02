
import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean,integer, jsonb } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  githubId: text('github_id').unique(),
  githubToken: text('github_token'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const repositories = pgTable("repositories", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  githubRepoId: integer("github_repo_id").notNull(),
  name: text("name").notNull(),
  fullName: text("full_name").notNull(),
  private: boolean("private").notNull(),
  language: text("language"),
  lastSyncAt: timestamp("last_sync_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const commits = pgTable("commits", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  repositoryId: text("repository_id").notNull().references(() => repositories.id, { onDelete: "cascade" }),
  githubCommitSha: text("github_commit_sha").notNull(),
  message: text("message").notNull(),
  authorName: text("author_name").notNull(),
  authorEmail: text("author_email").notNull(),
  committedAt: timestamp("committed_at").notNull(),
  classification: text("classification").notNull(),
  filesChanged: integer("files_changed").notNull(),
  additions: integer("additions").notNull(),
  deletions: integer("deletions").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const analyticsCache = pgTable("analytics_cache", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  cacheKey: text("cache_key").notNull(),
  data: jsonb("data").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  repositories: many(repositories),
  commits: many(commits),
  analyticsCache: many(analyticsCache),
}));

export const repositoriesRelations = relations(repositories, ({ one, many }) => ({
  user: one(user, {
    fields: [repositories.userId],
    references: [user.id],
  }),
  commits: many(commits),
}));

export const commitsRelations = relations(commits, ({ one }) => ({
  user: one(user, {
    fields: [commits.userId],
    references: [user.id],
  }),
  repository: one(repositories, {
    fields: [commits.repositoryId],
    references: [repositories.id],
  }),
}));

export const analyticsCacheRelations = relations(analyticsCache, ({ one }) => ({
  user: one(user, {
    fields: [analyticsCache.userId],
    references: [user.id],
  }),
}));