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
  // Garmin 绑定信息
  garminUserId: text("garmin_user_id"),
  garminAccessToken: text("garmin_access_token"), // 加密存储
  garminRefreshToken: text("garmin_refresh_token"), // 加密存储
  garminTokenExpireAt: timestamp("garmin_token_expire_at", { mode: "date" }),
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

// Activities table (运动记录)
export const activities = pgTable("activity", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  garminActivityId: text("garmin_activity_id").unique(),
  activityType: text("activity_type").notNull(), // 'running' | 'cycling' | 'swimming' | 'trail'
  name: text("name"),
  startTime: timestamp("start_time", { mode: "date" }).notNull(),
  durationSeconds: integer("duration_seconds"),
  distanceMeters: integer("distance_meters"),
  avgPaceSeconds: integer("avg_pace_seconds"),
  avgHr: integer("avg_hr"),
  maxHr: integer("max_hr"),
  elevationGain: integer("elevation_gain"),
  calories: integer("calories"),
  polyline: text("polyline"),
  fitFileUrl: text("fit_file_url"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

// Poster Templates table (海报模板)
export const posterTemplates = pgTable("poster_template", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  key: text("key").notNull().unique(), // 'achievement' | 'minimal' | 'art' | 'trail'
  category: text("category").notNull(),
  previewUrl: text("preview_url"),
  thumbnailUrl: text("thumbnail_url"),
  config: json("config").$type<{
    width: number;
    height: number;
    dataFields: string[];
    customFields?: string[];
  }>(),
  isFree: boolean("is_free").default(true),
  price: text("price"),
  sortOrder: integer("sort_order").default(0),
  status: text("status").default("active").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

// Posters table (用户海报)
export const posters = pgTable("poster", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  activityId: uuid("activity_id")
    .references(() => activities.id, { onDelete: "set null" }),
  templateId: integer("template_id")
    .notNull()
    .references(() => posterTemplates.id, { onDelete: "restrict" }),
  title: text("title"),
  imageUrl: text("image_url").notNull(),
  customText: text("custom_text"),
  tags: json("tags").$type<string[]>(),
  styleConfig: json("style_config").$type<{
    primaryColor?: string;
    font?: string;
  }>(),
  viewCount: integer("view_count").default(0),
  shareCount: integer("share_count").default(0),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type WatchFace = typeof watchFaces.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type Favorite = typeof favorites.$inferSelect;
export type Follow = typeof follows.$inferSelect;
export type Like = typeof likes.$inferSelect;
export type Activity = typeof activities.$inferSelect;
export type PosterTemplate = typeof posterTemplates.$inferSelect;
export type Poster = typeof posters.$inferSelect;
