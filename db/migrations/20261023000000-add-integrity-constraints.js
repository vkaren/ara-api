"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.addConstraint("posts", {
      fields: ["author_id"],
      type: "foreign key",
      name: "posts_author_id_fkey",
      references: { table: "users", field: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint("replies", {
      fields: ["author_id"],
      type: "foreign key",
      name: "replies_author_id_fkey",
      references: { table: "users", field: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    await queryInterface.addConstraint("replies", {
      fields: ["replying_to_user_id"],
      type: "foreign key",
      name: "replies_replying_to_user_id_fkey",
      references: { table: "users", field: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    await queryInterface.addConstraint("replies", {
      fields: ["replying_to_post"],
      type: "foreign key",
      name: "replies_replying_to_post_fkey",
      references: { table: "posts", field: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint("likes", {
      fields: ["user_id"],
      type: "foreign key",
      name: "likes_user_id_fkey",
      references: { table: "users", field: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    await queryInterface.addConstraint("likes", {
      fields: ["post_id"],
      type: "foreign key",
      name: "likes_post_id_fkey",
      references: { table: "posts", field: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    await queryInterface.addConstraint("likes", {
      fields: ["reply_id"],
      type: "foreign key",
      name: "likes_reply_id_fkey",
      references: { table: "replies", field: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint("follows", {
      fields: ["follow_from"],
      type: "foreign key",
      name: "follows_follow_from_fkey",
      references: { table: "users", field: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    await queryInterface.addConstraint("follows", {
      fields: ["follow_to"],
      type: "foreign key",
      name: "follows_follow_to_fkey",
      references: { table: "users", field: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint("notifications", {
      fields: ["user_from"],
      type: "foreign key",
      name: "notifications_user_from_fkey",
      references: { table: "users", field: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    await queryInterface.addConstraint("notifications", {
      fields: ["user_to"],
      type: "foreign key",
      name: "notifications_user_to_fkey",
      references: { table: "users", field: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    await queryInterface.addConstraint("notifications", {
      fields: ["post_id"],
      type: "foreign key",
      name: "notifications_post_id_fkey",
      references: { table: "posts", field: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addConstraint("auth", {
      fields: ["user_id"],
      type: "foreign key",
      name: "auth_user_id_fkey",
      references: { table: "users", field: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    await queryInterface.addConstraint("auth", {
      fields: ["user_id"],
      type: "unique",
      name: "auth_user_id_unique",
    });

    await queryInterface.addConstraint("follows", {
      fields: ["follow_from", "follow_to"],
      type: "unique",
      name: "follows_follow_from_follow_to_unique",
    });

    await queryInterface.sequelize.query(
      `ALTER TABLE follows
       ADD CONSTRAINT follows_no_self_follow_check
       CHECK (follow_from <> follow_to)`
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE likes
       ADD CONSTRAINT likes_one_target_check
       CHECK ((post_id IS NOT NULL) <> (reply_id IS NOT NULL))`
    );

    await queryInterface.sequelize.query(
      "CREATE UNIQUE INDEX likes_user_post_unique ON likes (user_id, post_id) WHERE post_id IS NOT NULL"
    );
    await queryInterface.sequelize.query(
      "CREATE UNIQUE INDEX likes_user_reply_unique ON likes (user_id, reply_id) WHERE reply_id IS NOT NULL"
    );

    await queryInterface.addIndex("posts", ["author_id"], {
      name: "posts_author_id_idx",
    });
    await queryInterface.addIndex("replies", ["author_id"], {
      name: "replies_author_id_idx",
    });
    await queryInterface.addIndex("replies", ["replying_to_post"], {
      name: "replies_replying_to_post_idx",
    });
    await queryInterface.addIndex("likes", ["user_id"], {
      name: "likes_user_id_idx",
    });
    await queryInterface.addIndex("notifications", ["user_to", "seen"], {
      name: "notifications_user_to_seen_idx",
    });
    await queryInterface.addIndex("follows", ["follow_from"], {
      name: "follows_follow_from_idx",
    });
    await queryInterface.addIndex("follows", ["follow_to"], {
      name: "follows_follow_to_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("follows", "follows_follow_to_idx");
    await queryInterface.removeIndex("follows", "follows_follow_from_idx");
    await queryInterface.removeIndex("notifications", "notifications_user_to_seen_idx");
    await queryInterface.removeIndex("likes", "likes_user_id_idx");
    await queryInterface.removeIndex("replies", "replies_replying_to_post_idx");
    await queryInterface.removeIndex("replies", "replies_author_id_idx");
    await queryInterface.removeIndex("posts", "posts_author_id_idx");

    await queryInterface.sequelize.query("DROP INDEX likes_user_reply_unique");
    await queryInterface.sequelize.query("DROP INDEX likes_user_post_unique");
    await queryInterface.removeConstraint("likes", "likes_one_target_check");
    await queryInterface.removeConstraint("follows", "follows_no_self_follow_check");

    await queryInterface.removeConstraint(
      "follows",
      "follows_follow_from_follow_to_unique"
    );
    await queryInterface.removeConstraint("auth", "auth_user_id_unique");
    await queryInterface.removeConstraint("auth", "auth_user_id_fkey");
    await queryInterface.removeConstraint("notifications", "notifications_post_id_fkey");
    await queryInterface.removeConstraint("notifications", "notifications_user_to_fkey");
    await queryInterface.removeConstraint("notifications", "notifications_user_from_fkey");
    await queryInterface.removeConstraint("follows", "follows_follow_to_fkey");
    await queryInterface.removeConstraint("follows", "follows_follow_from_fkey");
    await queryInterface.removeConstraint("likes", "likes_reply_id_fkey");
    await queryInterface.removeConstraint("likes", "likes_post_id_fkey");
    await queryInterface.removeConstraint("likes", "likes_user_id_fkey");
    await queryInterface.removeConstraint("replies", "replies_replying_to_post_fkey");
    await queryInterface.removeConstraint("replies", "replies_replying_to_user_id_fkey");
    await queryInterface.removeConstraint("replies", "replies_author_id_fkey");
    await queryInterface.removeConstraint("posts", "posts_author_id_fkey");
  },
};
