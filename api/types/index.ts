import type { Transaction } from "sequelize";

export type EntityId = number | string;

export type RequestOptions = {
  transaction?: Transaction;
};

export type PaginationQuery = {
  page?: number | string | null;
  limit?: number | string | null;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: PaginationMeta;
};

export type User = {
  id: number;
  nickname: string;
  username: string;
  bio: string | null;
  profile_photo: string | null;
};

export type UserSummary = Pick<
  User,
  "id" | "username" | "nickname" | "profile_photo"
>;

export type AuthRecord = {
  id: number;
  user_id: number;
  username: string;
  password: string;
};

export type AuthLookupQuery = {
  where: {
    username?: string;
    user_id?: number;
  };
};

export type AuthTokenPayload = {
  id: number;
  username: string;
};

export type LoginInput = {
  username: string;
  password: string;
};

export type AuthInput = LoginInput & {
  user_id: number;
};

export type UpdateAuthInput = {
  user_id: number;
  username?: string;
  password?: string;
};

export type UserInput = {
  nickname: string;
  username: string;
  password: string;
  bio?: string;
  profile_photo?: string | null;
};

export type UserPersistenceInput = Pick<User, "nickname" | "username"> &
  Partial<Pick<User, "bio" | "profile_photo">>;

export type UserUpdateData = Partial<
  Pick<User, "nickname" | "username" | "bio" | "profile_photo">
>;

export type UpdateUserInput = Partial<Omit<UserInput, "password">> & {
  id: EntityId;
  password?: string;
};

export type Post = {
  id: number;
  author_id: number;
  content: string;
  inserted_image: string | null;
  createdAt: Date;
  author?: UserSummary;
};

export type CreatePostInput = {
  author_id: number;
  content: string;
  inserted_image?: string | null;
};

export type DeletePostInput = {
  author_id: number;
  post_id: number;
};

export type Reply = {
  id: number;
  author_id: number;
  replying_to_user_id: number;
  replying_to_post: number;
  content: string;
  inserted_image: string | null;
  createdAt: Date;
  author?: UserSummary;
};

export type CreateReplyInput = {
  author_id: number;
  content: string;
  replying_to_user: number;
  replying_to_post: number;
  inserted_image?: string | null;
};

export type ReplyPersistenceInput = Omit<
  CreateReplyInput,
  "replying_to_user"
> & {
  replying_to_user_id: number;
};

export type DeleteReplyInput = {
  author_id: number;
  reply_id: number;
};

export type Follow = {
  id: number;
  follow_from: number;
  follow_to: number;
};

export type FollowInput = {
  follow_from: number;
  follow_to: number;
};

export type FollowListType = "followers" | "following";

export type LikeTargetType = "post" | "reply";

export type LikeInput = {
  user_id: number;
  message_id: number;
  type: LikeTargetType;
};

export type Like = {
  id: number;
  user_id: number;
  post_id: number | null;
  reply_id: number | null;
};

export type LikePersistenceInput = {
  user_id: number;
  post_id?: number;
  reply_id?: number;
};

export type UserQuery = {
  attributes?: string[];
  include?: readonly unknown[];
  where?: Record<string, unknown>;
  limit?: number;
  offset?: number;
  order?: readonly (string | "ASC" | "DESC")[][];
};

export type NotificationType = "follow" | "reply" | "like";

export type Notification = {
  id: number;
  user_from: number;
  user_to: number;
  type: NotificationType;
  post_id: number | null;
  seen: boolean;
  notif_from?: UserSummary;
};

export type NotificationInput = {
  user_from: number;
  user_to: number;
  type: NotificationType;
  post_id?: number;
};

export type PaginatedPosts = PaginatedResponse<Post>;
export type PaginatedNotifications = PaginatedResponse<Notification>;
