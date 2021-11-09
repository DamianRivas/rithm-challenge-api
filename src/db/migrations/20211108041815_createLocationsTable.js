exports.up = function (knex) {
  return knex.schema.createTable("locations", (table) => {
    table.increments("id").primary().notNullable();
    table.string("last_location").notNullable();
    table.string("lat").notNullable();
    table.string("long").notNullable();
    table.integer("user_id").unsigned().notNullable();
    table
      .foreign("user_id")
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("locations");
};
