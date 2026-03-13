import { pgTable, text, timestamp, uuid, boolean, integer, json, primaryKey } from "drizzle-orm/pg-core";

// NextAuth.js required tables
export const accounts = pgTable("account", {
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").$type<"oauth" | "email" | "credentials">().notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// Users table
export const users = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  bio: text("bio"),
  role: text("role").default("user").notNull(), // 'admin' | 'user'
  status: text("status").default("active").notNull(), // 'active' | 'disabled'
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow(),
});

// Watch Faces table
export const watchFaces = pgTable("watch_face", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // 'analog' | 'digital' | 'hybrid' | 'fitness'
  tags: json("tags").$type<string[]>().default([]),
  thumbnailUrl: text("thumbnail_url"),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size"), // in bytes
  downloads: integer("downloads").default(0).notNull(),
  likes: integer("likes").default(0).notNull(),
  status: text("status").default("pending").notNull(), // 'pending' | 'approved' | 'rejected'
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

// Comments table
export const comments = pgTable("comment", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  watchFaceId: uuid("watch_face_id")
    .notNull()
    .references(() => watchFaces.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  rating: integer("rating"), // 1-5 stars
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

// Favorites table
export const favorites = pgTable("favorite", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  watchFaceId: uuid("watch_face_id")
    .notNull()
    .references(() => watchFaces.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

// Follows table (user follow relationships)
export const follows = pgTable("follow", {
  id: uuid("id").defaultRandom().primaryKey(),
  followerId: text("follower_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  followingId: text("following_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

// Likes table
export const likes = pgTable("like", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  watchFaceId: uuid("watch_face_id")
    .notNull()
    .references(() => watchFaces.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type WatchFace = typeof watchFaces.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type Favorite = typeof favorites.$inferSelect;
export type Follow = typeof follows.$inferSelect;
export type Like = typeof likes.$inferSelect;
