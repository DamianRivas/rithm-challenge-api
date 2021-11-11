const GeoJSON = require("geojson");
const userService = require("../services/users.services");
const { filterLocations } = require("../services/geo.services");

function normalizeQuery(query) {
  // dist is in miles
  if (query.dist) {
    const dist = Number(query.dist);
    query.dist = isNaN(dist) ? undefined : dist;
  }
  // min and max age are inclusive
  if (query.min_age) {
    const min_age = Number(query.min_age);
    query.min_age = isNaN(min_age) ? undefined : min_age;
  }
  if (query.max_age) {
    const max_age = Number(query.max_age);
    query.max_age = isNaN(max_age) ? undefined : max_age;
  }
  if (query.fav_color) {
    query.fav_color = query.fav_color.toLowerCase();
  }
}

function formatResultsToGeoJSON(users, locations) {
  return users.map(({ user_id: id, name, age, fav_color }) => ({
    type: "user",
    locationHistory: GeoJSON.parse(
      locations
        .filter((l) => l.user_id === id)
        .map(({ last_location: city, lat, long }) => ({
          city,
          lat,
          long,
        })),
      {
        Point: ["lat", "long"],
      }
    ),
    properties: {
      id,
      name,
      age,
      fav_color,
    },
  }));
}

async function getUsers(req, res, next) {
  const { query } = req;

  normalizeQuery(query);

  let users = await userService.queryUsers(query);
  let locations = await userService.queryUsersLocationHistories(
    users.map(({ user_id }) => user_id)
  );

  // If a Geo parameter is present, filter the locations and then the users
  if (query.origin) {
    try {
      locations = filterLocations(locations, query.origin, query.dist);
      const remainingUserIds = locations.map(({ user_id }) => user_id);
      users = users.filter(({ user_id }) => remainingUserIds.includes(user_id));
    } catch (e) {
      return next(e);
    }
  }

  try {
    users = formatResultsToGeoJSON(users, locations);
  } catch (e) {
    return next(e);
  }

  res.json({
    metadata: { path: req.baseUrl, query },
    num_results: users.length,
    results: users,
  });
}

function validateOrigin(req, res, next) {
  if (req.query.origin) {
    const origin = req.query.origin.trim();
    req.query.origin = origin;
    const values = origin.split(",").map((c) => Number(c));
    if (values.length === 2) {
      const [lat, long] = values;
      if (
        isNaN(lat) ||
        isNaN(long) ||
        lat > 90 ||
        lat < -90 ||
        long > 180 ||
        long < -180
      ) {
        req.query.origin = undefined;
      }
    } else {
      req.query.origin = undefined;
    }
  }
  // console.log("ORIGIN", req.query.origin);
  next();
}

module.exports = {
  getUsers: [validateOrigin, getUsers],
};
