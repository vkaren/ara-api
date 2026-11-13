import type {
  CreatePostInput,
  DeletePostInput,
  EntityId,
  PaginationQuery,
  RequestOptions,
} from "../../types";

const boom = require("@hapi/boom");
const { getFileUrl } = require("../../../libs/multer");
const { socket } = require("../../../libs/socket");
const store = require("./store");

async function listPosts({
  author_id = null,
  page,
  limit,
}: PaginationQuery & { author_id?: number | null }) {
  return await store.list(author_id, { page, limit });
}

async function getPost(
  { id }: { id: EntityId },
  options: RequestOptions = {}
) {
  const post = await store.get(id, options);

  if (!post) {
    throw boom.notFound(`Post ${id} doesn't exist`);
  }

  return post;
}

async function createPost({
  author_id,
  content,
  inserted_image,
}: CreatePostInput) {
  const data: CreatePostInput = {
    author_id,
    content,
  };

  if (inserted_image) {
    data.inserted_image = getFileUrl(inserted_image);
  }

  const newPost = await store.create(data);
  const post = await getPost({ id: newPost.id });

  socket.io.emit("new post", { post });

  return post;
}

async function deletePost({ author_id, post_id }: DeletePostInput) {
  await getPost({ id: post_id });

  const deletedPosts = await store.delete(post_id, author_id);

  if (deletedPosts === 0) {
    throw boom.forbidden("You cannot delete this post");
  }

  return { postDeleted: post_id };
}

module.exports = {
  createPost,
  listPosts,
  getPost,
  deletePost,
};
