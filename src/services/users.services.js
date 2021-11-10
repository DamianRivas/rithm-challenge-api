const knex = require("../db/connection");

function queryUsers({ fav_color, dist, origin, min_age, max_age }) {
  return knex("users")
    .select("*")
    .where((builder) => {
      if (fav_color) {
        builder.where({ fav_color });
      }
      if (min_age) {
        builder.where("age", ">=", min_age);
      }
      if (max_age) {
        builder.where("age", "<=", max_age);
      }
      return builder;
    });
}

function queryUsersLocationHistories(userIds) {
  return knex("locations")
    .select("user_id", "last_location", "lat", "long")
    .whereIn("user_id", userIds)
    .orderBy("id", "desc");
}

module.exports = {
  queryUsers,
  queryUsersLocationHistories,
};
