const fs = require("fs").promises;
const path = require("path");
const parse = require("csv-parse/lib/sync");

// Parses the provided CSV file and organizes the data for DB insertion
async function parseData() {
  const content = await fs.readFile(
    path.join(__dirname, "../../..", "data", "users.csv")
  );
  const records = parse(content, { columns: true, skipEmptyLines: true });
  const data = new Map();
  const locations = [];

  for (let row of records) {
    let {
      user_id,
      user_name,
      user_age,
      user_fav_color,
      last_location,
      lat,
      long,
    } = row;
    user_id = Number(user_id);
    user_age = Number(user_age);

    if (!data.has(user_id)) {
      data.set(user_id, {
        name: user_name,
        age: user_age,
        fav_color: user_fav_color,
      });
    }
    locations.push({ last_location, lat, long, user_id });
  }

  return [data, locations];
}

exports.seed = function (knex) {
  // Delete contents of the databases and parse the CSV
  return knex("locations")
    .del()
    .then(() => knex.raw("TRUNCATE TABLE users RESTART IDENTITY CASCADE"))
    .then(parseData)
    .then(([data, locations]) => {
      const usersArray = [];
      for (let user of data.values()) {
        usersArray.push(user);
      }
      // Insert parsed data into database
      return knex("users")
        .insert(usersArray)
        .then(() => knex("locations").insert(locations));
    });
};
