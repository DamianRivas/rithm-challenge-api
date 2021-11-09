exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("user_id").primary().notNullable();
    table.string("name").notNullable();
    table.integer("age").notNullable();
    table.string("fav_color").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
