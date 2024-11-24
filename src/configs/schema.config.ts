import { timestamps } from '@/utils/schema.helper';
import { sql } from 'drizzle-orm';
import {
  boolean,
  date,
  datetime,
  decimal,
  float,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  text,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/mysql-core';
import { room_amenities } from './../utils/schema.helper';

export const users = mysqlTable('users', {
  id: int().primaryKey().autoincrement(),
  password: varchar({ length: 255 }).notNull(),
  provider: mysqlEnum(['local', 'facebook', 'google']).notNull().default('local'),
  status: mysqlEnum(['banned', 'actived', 'unactived']).notNull().default('unactived'),
  googleId: varchar('google_id', { length: 255 }).unique(),
  tokenVersion: int('token_version').notNull().default(0),
  ...timestamps,
});

export const userDetail = mysqlTable('users_detail', {
  userId: int('user_id')
    .primaryKey()
    .references(() => users.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  role: mysqlEnum(['renter', 'landlord']),
  email: varchar({ length: 255 }).unique().notNull(),
  bio: text(),
  phone: varchar({ length: 25 }).notNull(),
  firstName: varchar('first_name', { length: 50 }).notNull(),
  lastName: varchar('last_name', { length: 50 }).notNull(),
  gender: mysqlEnum(['male', 'female', 'others']),
  dob: datetime(),
  isEmailVerified: boolean('is_email_verified').default(false),
  isPhoneVerified: boolean('is_phone_verified').default(false),
  avatarAssetId: int('avatar_asset_id').references(() => assets.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  ...timestamps,
});

export const addresses = mysqlTable(
  'addresses',
  {
    id: int().primaryKey().autoincrement(),
    userId: int('user_id').references(() => users.id),
    addressCode: varchar('address_code', { length: 255 }),
    provinceName: varchar('province_name', { length: 255 }).notNull(),
    districtName: varchar('district_name', { length: 255 }).notNull(),
    wardName: varchar('ward_name', { length: 255 }).notNull(),
    detail: text(),
    postalCode: varchar('postal_code', { length: 25 }),
    isDefault: boolean('is_default').default(false),
    latitude: decimal({ precision: 10, scale: 8 }), // Đủ lưu -90 đến 90
    longitude: decimal({ precision: 11, scale: 8 }), // Đủ lưu -180 đến 180
    ...timestamps,
  },
  (table) => {
    return {
      idxUser: index('idx_addresses_user_id').on(table.userId),
      idxWard: index('idx_addresses_ward_name').on(table.districtName),
      idxProvinceDistrictWard: index('idx_addresses_ward_name_district_name_province_id').on(
        table.wardName,
        table.districtName,
        table.provinceName,
      ),
    };
  },
);

export const tokens = mysqlTable(
  'tokens',
  {
    id: int().primaryKey().autoincrement(),
    value: varchar({ length: 255 }).notNull(),
    type: mysqlEnum(['refresh', 'otp', 'text', 'verify']).notNull().default('text'),
    isActived: boolean('is_actived').default(true),
    expirationTime: datetime('expiration_time').notNull(),
    userId: int('user_id').references(() => users.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    target: varchar({ length: 255 }),
    ...timestamps,
  },
  (table) => ({
    idxValue: unique('idx_tokens_value').on(table.value),
    idxValueType: index('idx_tokens_value_type').on(table.value, table.type),
  }),
);

export const assets = mysqlTable(
  'assets',
  {
    id: int().primaryKey().autoincrement(),
    type: mysqlEnum(['image', 'video']).notNull(),
    url: text().notNull(),
    name: varchar({ length: 255 }).notNull(),
    format: varchar({ length: 25 }),
    tags: json(),
    folder: varchar({ length: 255 }),
    userId: int('user_id').references(() => users.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    postId: int('post_id').references(() => posts.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    ...timestamps,
  },
  (table) => ({
    idxPostId: index('idx_assets_post_id').on(table.postId),
    idxUserIdPostId: index('idx_assets_user_id_post_id').on(table.userId, table.postId),
  }),
);

export const properties = mysqlTable('properties', {
  id: int().primaryKey().autoincrement(),
  ownerId: int('owner_id').references(() => users.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  addressId: int('address_id').references(() => addresses.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  totalArea: float('total_area'),
  totalAreaUnit: mysqlEnum(['cm2', 'm2', 'km2']).default('m2'),
  priceRangeStart: int('price_range_start').default(0),
  priceRangeEnd: int('price_range_end'),
  isActived: boolean('is_actived').default(true),
  ...timestamps,
});

export const posts = mysqlTable('posts', {
  id: int().primaryKey().autoincrement(),
  ownerId: int('owner_id').references(() => users.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  title: varchar({ length: 255 }).notNull(),
  titleSlug: varchar('title_slug', { length: 255 }),
  description: text(),
  expirationAfter: int('expiration_after'),
  expirationAfterUnit: mysqlEnum('expiration_after_unit', ['hour', 'day', 'week', 'month']).default('day'),
  status: mysqlEnum(['actived', 'unactived']).default('actived'),
  type: mysqlEnum(['rental', 'pass', 'join', 'wanted']).notNull(),
  note: text(),
  viewedCount: int('viewed_count').default(0),
  addressCode: varchar('address_code', { length: 255 }),
  addressProvince: varchar('address_province', { length: 255 }).notNull(),
  addressDistrict: varchar('address_district', { length: 255 }).notNull(),
  addressDetail: varchar('address_detail', { length: 255 }),
  addressWard: varchar('address_ward', { length: 255 }).notNull(),
  addressLongitude: decimal('address_longitude', { precision: 11, scale: 8 }),
  addressLatitude: decimal('address_latitude', { precision: 10, scale: 8 }),
  ...timestamps,
});

export const postAssets = mysqlTable(
  'post_assets',
  {
    postId: int('post_id').references(() => posts.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    assetId: int('asset_id').references(() => assets.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    ...timestamps,
  },
  (table) => ({
    pkPostIdAssetId: primaryKey({
      name: 'pk_post_id_asset_id',
      columns: [table.postId, table.assetId],
    }),
  }),
);

export const rentalPosts = mysqlTable('rental_posts', {
  postId: int('post_id')
    .primaryKey()
    .notNull()
    .references(() => posts.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  numberRoomAvailable: int('number_room_available').default(1),
  priceStart: int('price_start').notNull(),
  priceEnd: int('price_end'),
  priceUnit: mysqlEnum('price_unit', ['vnd', 'usd']).default('vnd'),
  minLeaseTerm: int('min_lease_term').notNull(),
  minLeaseTermUnit: mysqlEnum('min_lease_term_unit', ['hour', 'day', 'month', 'year']).notNull(),
  totalArea: float('total_area'),
  totalAreaUnit: mysqlEnum(['cm2', 'm2', 'km2']).default('m2'),
  ...room_amenities,
});

export const wantedPosts = mysqlTable('wanted_posts', {
  postId: int('post_id')
    .primaryKey()
    .notNull()
    .references(() => posts.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  priceStart: int('price_start').notNull(),
  priceEnd: int('price_end'),
  priceUnit: mysqlEnum('price_unit', ['vnd', 'usd']).default('vnd'),
  moveInDate: date('move_in_date').notNull(),
  totalArea: float('total_area'),
  totalAreaUnit: mysqlEnum(['cm2', 'm2', 'km2']).default('m2'),
  ...room_amenities,
});

export const joinPosts = mysqlTable('join_posts', {
  postId: int('post_id')
    .primaryKey()
    .notNull()
    .references(() => posts.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  priceStart: int('price_start').notNull(),
  priceEnd: int('price_end'),
  priceUnit: mysqlEnum('price_unit', ['vnd', 'usd']).default('vnd'),
  moveInDate: date('move_in_date').notNull(),
  totalArea: float('total_area'),
  totalAreaUnit: mysqlEnum(['cm2', 'm2', 'km2']).default('m2'),
  ...room_amenities,
});

export const passPosts = mysqlTable('pass_posts', {
  postId: int('post_id')
    .primaryKey()
    .notNull()
    .references(() => posts.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  priceStart: int('price_start').notNull(),
  priceEnd: int('price_end'),
  priceUnit: mysqlEnum('price_unit', ['vnd', 'usd']).default('vnd'),
});

export const passPostItems = mysqlTable('pass_post_items', {
  id: int().primaryKey().autoincrement(),
  passPostId: int('pass_post_id')
    .notNull()
    .references(() => posts.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  passItemName: varchar('pass_item_name', { length: 255 }).notNull(),
  passItemNameSlug: varchar('pass_item_name_slug', { length: 255 }),
  passItemPrice: int('pass_item_price').notNull(),
  passItemStatus: mysqlEnum('pass_item_status', ['new', 'used']),
});

export const userPostReactions = mysqlTable(
  'user_post_reactions',
  {
    userId: int('user_id').references(() => users.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    postId: int('post_id').references(() => posts.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    reactionType: mysqlEnum('reaction_type', ['like', 'heart', 'funny', 'angry', 'sad']),
    ...timestamps,
  },
  (table) => ({
    pkUserPostReaction: primaryKey({ name: 'pk_user_id_post_id', columns: [table.userId, table.postId] }),
    idxUserIdPostId: unique('idx_user_id_post_id').on(table.userId, table.postId),
  }),
);

export const postComments = mysqlTable('post_comments', {
  id: int().primaryKey().autoincrement(),
  content: text().notNull(),
  postId: int('post_id')
    .notNull()
    .references(() => posts.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  ...timestamps,
});

export const postCommentClosures = mysqlTable(
  'post_comment_closures',
  {
    ancestorId: int('ancestor_id')
      .notNull()
      .references(() => postComments.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    descendantId: int('descendant_id')
      .notNull()
      .references(() => postComments.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    depth: int().notNull(),
  },
  (table) => ({
    pkPostCommentClosures: primaryKey({
      name: 'pk_post_comment_closures',
      columns: [table.ancestorId, table.descendantId],
    }),
    idxDescendantIdAncestorId: index('idx_post_comment_closures_ancestor_id_descendant_id').on(
      table.descendantId,
      table.ancestorId,
    ),
    idxDescendantId: index('idx_post_comment_closures_descendant_id').on(table.descendantId),
    idxAncestorId: index('idx_post_comment_closures_ancestor_id').on(table.ancestorId),
  }),
);

export const chats = mysqlTable('chats', {
  id: int().primaryKey().autoincrement(),
  title: varchar({ length: 255 }),
  type: mysqlEnum(['group', 'individual']).notNull(),
  ...timestamps,
});

export const chatMembers = mysqlTable(
  'chat_members',
  {
    id: int().primaryKey().autoincrement(),
    chatId: int('chat_id').references(() => chats.id),
    userId: int('user_id').references(() => users.id),
    joinedAt: timestamp('joined_at')
      .notNull()
      .default(sql`(now())`),
    lastReadAt: timestamp('last_read_at').onUpdateNow(),
  },
  (table) => ({
    idxUserIdChatId: unique('idx_chat_members_chatId_userId').on(table.userId, table.chatId),
    idxJoinedAtLastReadAt: index('idx_chat_members_last_read_at_joined_at').on(table.lastReadAt, table.joinedAt),
  }),
);

export const messages = mysqlTable('messages', {
  id: int().primaryKey().autoincrement(),
  senderId: int('sender_id')
    .notNull()
    .references(() => users.id),
  content: text().notNull(),
  assetId: int('asset_id').references(() => assets.id),
  messageType: mysqlEnum('message_type', ['text', 'file']).notNull(),
  sentAt: datetime('sent_at')
    .notNull()
    .default(sql`now()`),
  allowRecallTime: datetime('allow_recall_time').notNull(),
  isRecalled: boolean('is_recalled').notNull().default(false),
  recalledAt: timestamp('recalled_at'),
});

export const notifications = mysqlTable('notifications', {
  id: int().primaryKey().autoincrement(),
  type: mysqlEnum(['chat', 'post', 'account']).notNull(),
  title: varchar({ length: 255 }).notNull(),
  content: text(),
  isRead: boolean('is_read').default(false),
  userId: int('user_id')
    .notNull()
    .references(() => users.id),
  postId: int('post_id').references(() => posts.id),
  ...timestamp,
});
