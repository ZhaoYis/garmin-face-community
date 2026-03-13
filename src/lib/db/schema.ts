import { pgTable, text, timestamp, uuid, boolean, integer, json } from "drizzle-orm/pg-core";

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
