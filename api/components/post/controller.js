const boom = require("@hapi/boom");
const { getFileUrl } = require("../../../libs/multer");
const { socket } = require("../../../libs/socket");
const store = require("./store");

async function listPosts({ author_id = null }) {
  const posts = await store.list(author_id);
  return posts;
}

async function getPost({ id }) {
  const post = await store.get(id);

  if (!post) {
    throw boom.notFound(`Post ${id} doesn't exist`);
  }

  return post;
}

async function createPost({ author_id, content, inserted_image }) {
  const data = {
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

async function deletePost({ post_id }) {
  await getPost({ id: post_id });

  await store.delete(post_id);

  return { postDeleted: post_id };
}

module.exports = {
  createPost,
  listPosts,
  getPost,
  deletePost,
};
