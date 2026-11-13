"use strict";

async function constraintExists(queryInterface, tableName, constraintName, transaction) {
  const [rows] = await queryInterface.sequelize.query(
    `SELECT 1 FROM pg_constraint
     WHERE conname = :constraintName
       AND conrelid = to_regclass(:tableName)`,
    { replacements: { constraintName, tableName }, transaction }
  );
  return rows.length > 0;
}

async function ensureConstraint(queryInterface, tableName, options, transaction) {
  if (await constraintExists(queryInterface, tableName, options.name, transaction)) {
    return;
  }
  await queryInterface.addConstraint(tableName, { ...options, transaction });
}

async function ensureIndex(queryInterface, tableName, fields, options, transaction) {
  const [rows] = await queryInterface.sequelize.query(
    `SELECT 1
     FROM pg_class index_class
     JOIN pg_namespace index_namespace ON index_namespace.oid = index_class.relnamespace
     JOIN pg_index index_info ON index_info.indexrelid = index_class.oid
     JOIN pg_class table_class ON table_class.oid = index_info.indrelid
     WHERE index_class.relname = :indexName
       AND table_class.relname = :tableName
       AND index_namespace.nspname = current_schema()`,
    { replacements: { indexName: options.name, tableName }, transaction }
  );
  if (rows.length > 0) {
    return;
  }
  await queryInterface.addIndex(tableName, fields, { ...options, transaction });
}

async function ensureRawIndex(queryInterface, indexName, statement, transaction) {
  const [rows] = await queryInterface.sequelize.query(
    `SELECT 1 FROM pg_class WHERE relname = :indexName`,
    { replacements: { indexName }, transaction }
  );
  if (rows.length > 0) {
    return;
  }
  await queryInterface.sequelize.query(statement, { transaction });
}

async function addRawConstraint(queryInterface, tableName, constraintName, definition, transaction) {
  if (await constraintExists(queryInterface, tableName, constraintName, transaction)) {
    return;
  }
  await queryInterface.sequelize.query(
    `ALTER TABLE ${tableName} ADD CONSTRAINT ${constraintName} ${definition}`,
    { transaction }
  );
}

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const foreignKeys = [
        ["posts", "author_id", "users", "posts_author_id_fkey", "CASCADE"],
        ["replies", "author_id", "users", "replies_author_id_fkey", "CASCADE"],
        ["replies", "replying_to_user_id", "users", "replies_replying_to_user_id_fkey", "CASCADE"],
        ["replies", "replying_to_post", "posts", "replies_replying_to_post_fkey", "CASCADE"],
        ["likes", "user_id", "users", "likes_user_id_fkey", "CASCADE"],
        ["likes", "post_id", "posts", "likes_post_id_fkey", "CASCADE"],
        ["likes", "reply_id", "replies", "likes_reply_id_fkey", "CASCADE"],
        ["follows", "follow_from", "users", "follows_follow_from_fkey", "CASCADE"],
        ["follows", "follow_to", "users", "follows_follow_to_fkey", "CASCADE"],
        ["notifications", "user_from", "users", "notifications_user_from_fkey", "CASCADE"],
        ["notifications", "user_to", "users", "notifications_user_to_fkey", "CASCADE"],
        ["notifications", "post_id", "posts", "notifications_post_id_fkey", "SET NULL"],
        ["auth", "user_id", "users", "auth_user_id_fkey", "CASCADE"],
      ];

      for (const [table, field, referenceTable, name, onDelete] of foreignKeys) {
        await ensureConstraint(queryInterface, table, {
          fields: [field],
          type: "foreign key",
          name,
          references: { table: referenceTable, field: "id" },
          onUpdate: "CASCADE",
          onDelete,
        }, transaction);
      }

      await ensureConstraint(queryInterface, "auth", {
        fields: ["user_id"],
        type: "unique",
        name: "auth_user_id_unique",
      }, transaction);
      await ensureConstraint(queryInterface, "follows", {
        fields: ["follow_from", "follow_to"],
        type: "unique",
        name: "follows_follow_from_follow_to_unique",
      }, transaction);

      await addRawConstraint(queryInterface, "follows", "follows_no_self_follow_check", "CHECK (follow_from <> follow_to)", transaction);
      await addRawConstraint(queryInterface, "likes", "likes_one_target_check", "CHECK ((post_id IS NOT NULL) <> (reply_id IS NOT NULL))", transaction);

      await ensureRawIndex(
        queryInterface,
        "likes_user_post_unique",
        "CREATE UNIQUE INDEX likes_user_post_unique ON likes (user_id, post_id) WHERE post_id IS NOT NULL",
        transaction
      );
      await ensureRawIndex(
        queryInterface,
        "likes_user_reply_unique",
        "CREATE UNIQUE INDEX likes_user_reply_unique ON likes (user_id, reply_id) WHERE reply_id IS NOT NULL",
        transaction
      );

      const indexes = [
        ["posts", ["author_id"], "posts_author_id_idx"],
        ["replies", ["author_id"], "replies_author_id_idx"],
        ["replies", ["replying_to_post"], "replies_replying_to_post_idx"],
        ["likes", ["user_id"], "likes_user_id_idx"],
        ["notifications", ["user_to", "seen"], "notifications_user_to_seen_idx"],
        ["follows", ["follow_from"], "follows_follow_from_idx"],
        ["follows", ["follow_to"], "follows_follow_to_idx"],
      ];
      for (const [table, fields, name] of indexes) {
        await ensureIndex(queryInterface, table, fields, { name }, transaction);
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const indexes = [
        ["follows", "follows_follow_to_idx"],
        ["follows", "follows_follow_from_idx"],
        ["notifications", "notifications_user_to_seen_idx"],
        ["likes", "likes_user_id_idx"],
        ["replies", "replies_replying_to_post_idx"],
        ["replies", "replies_author_id_idx"],
        ["posts", "posts_author_id_idx"],
        ["likes", "likes_user_reply_unique"],
        ["likes", "likes_user_post_unique"],
      ];
      for (const [table, name] of indexes) {
        await queryInterface.sequelize.query(`DROP INDEX IF EXISTS ${name}`, { transaction });
      }

      const constraints = [
        ["likes", "likes_one_target_check"],
        ["follows", "follows_no_self_follow_check"],
        ["follows", "follows_follow_from_follow_to_unique"],
        ["auth", "auth_user_id_unique"],
        ["auth", "auth_user_id_fkey"],
        ["notifications", "notifications_post_id_fkey"],
        ["notifications", "notifications_user_to_fkey"],
        ["notifications", "notifications_user_from_fkey"],
        ["follows", "follows_follow_to_fkey"],
        ["follows", "follows_follow_from_fkey"],
        ["likes", "likes_reply_id_fkey"],
        ["likes", "likes_post_id_fkey"],
        ["likes", "likes_user_id_fkey"],
        ["replies", "replies_replying_to_post_fkey"],
        ["replies", "replies_replying_to_user_id_fkey"],
        ["replies", "replies_author_id_fkey"],
        ["posts", "posts_author_id_fkey"],
      ];
      for (const [table, name] of constraints) {
        await queryInterface.sequelize.query(
          `ALTER TABLE ${table} DROP CONSTRAINT IF EXISTS ${name}`,
          { transaction }
        );
      }
    });
  },
};
