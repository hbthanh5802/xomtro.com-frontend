import * as schema from '@/configs/schema.config';

export enum userRole {
  RENTER = 'renter',
  LANDLORD = 'landlord',
}

export enum userStatus {
  BANNED = 'banned',
  ACTIVED = 'actived',
  UNACTIVED = 'unactived',
}

export enum userProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
}

export enum userGender {
  MALE = 'male',
  FEMALE = 'female',
  OTHERS = 'others',
}

export enum tokenType {
  REFRESH = 'refresh',
  OTP = 'otp',
  VERIFY = 'verify',
  TEXT = 'text',
}

export enum areaUnit {
  CM2 = 'cm2',
  m2 = 'm2',
}

export enum propertyStatus {
  NEW = 'new',
  GOOD = 'good',
  OLD = 'old',
}

export enum timeUnit {
  DAY = 'day',
  HOUR = 'hour',
  MINUTE = 'minute',
  YEAR = 'year',
  SECOND = 'second',
  MONTH = 'month',
}

export enum postStatus {
  ACTIVED = 'actived',
  UNACTIVED = 'unactived',
}

export enum postType {
  RENTAL = 'rental',
  JOIN = 'join',
  WANTED = 'wanted',
  PASS = 'pass',
}

export enum postExpirationUnit {
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

export enum assetType {
  VIDEO = 'video',
  IMAGE = 'image',
}

export enum priceUnit {
  VND = 'vnd',
  USD = 'usd',
}

export enum rentalMinLeaseUnit {
  DAY = 'day',
  HOUR = 'hour',
  YEAR = 'year',
  MONTH = 'month',
}

export enum passItemStatusType {
  NEW = 'new',
  USED = 'used',
}

export enum postReactionType {
  LIKE = 'like',
  HEART = 'heart',
  FUNNY = 'funny',
  ANGRY = 'angry',
  SAD = 'sad',
}

export enum chatType {
  GROUP = 'group',
  INDIVIDUAL = 'individual',
}

export enum messageType {
  TEXT = 'text',
  FILE = 'file',
}

export enum notificationType {
  CHAT = 'chat',
  POST = 'post',
  ACCOUNT = 'account',
}

export type UserInsertSchemaType = typeof schema.users.$inferInsert;
export type UserDetailInsertSchemaType = typeof schema.userDetail.$inferInsert;
export type TokenInsertSchemaType = typeof schema.tokens.$inferInsert;
export type AssetInsertSchemaType = typeof schema.assets.$inferInsert;
export type AddressInsertSchemaType = typeof schema.addresses.$inferInsert;
export type PostInsertSchemaType = typeof schema.posts.$inferInsert;
export type RentalPostInsertSchemaType = typeof schema.rentalPosts.$inferInsert;
export type WantedPostInsertSchemaType = typeof schema.wantedPosts.$inferInsert;
export type JoinPostInsertSchemaType = typeof schema.joinPosts.$inferInsert;
export type PassPostInsertSchemaType = typeof schema.passPosts.$inferInsert;
export type PostAssetsInsertSchemaType = typeof schema.postAssets.$inferInsert;
export type PassPostItemInsertSchemaType = typeof schema.passPostItems.$inferInsert;

export type UserDetailSelectSchemaType = typeof schema.userDetail.$inferSelect;
export type AssetSelectSchemaType = typeof schema.assets.$inferSelect;
export type AddressSelectSchemaType = typeof schema.addresses.$inferSelect;
export type PostSelectSchemaType = typeof schema.posts.$inferSelect;
export type RentalPostSelectSchemaType = typeof schema.rentalPosts.$inferSelect;
export type WantedPostSelectSchemaType = typeof schema.wantedPosts.$inferSelect;
export type JoinPostSelectSchemaType = typeof schema.joinPosts.$inferSelect;
export type PassPostSelectSchemaType = typeof schema.passPosts.$inferSelect;
export type PassPostItemSelectSchemaType = typeof schema.passPostItems.$inferSelect;
