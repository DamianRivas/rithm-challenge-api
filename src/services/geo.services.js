const geolib = require("geolib");

function parseLatLong(coordinateString) {
  return coordinateString.split(",").map((axis) => Number(axis));
}

function milesToMeters(miles) {
  return miles * 1.60934 * 1000;
}

function filterLocations(locations, origin, dist = 0) {
  const [lat, long] = parseLatLong(origin);
  return locations
    .map((l) => ({
      ...l,
      lat: Number(l.lat),
      long: Number(l.long),
    }))
    .filter(
      (l) =>
        geolib.getPathLength([
          { latitude: l.lat, longitude: l.long },
          { latitude: lat, longitude: long },
        ]) <= milesToMeters(dist)
    );
}

module.exports = {
  milesToMeters,
  parseLatLong,
  filterLocations,
};
