const request = require("supertest");

const app = require("../src/app");

const userEndpoint = "/users";
const providedParams =
  "?fav_color=red&dist=100&origin=37.774929,-122.419416&min_age=21&max_age=29";

describe("App", () => {
  describe("not found handler", () => {
    test("returns 404 status code for non-existent routes", async () => {
      const nonexistentRoute = "/thisroutedefinitelydoesnotexist";
      const response = await request(app)
        .get(nonexistentRoute)
        .set("Accept", "application/json");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe(`Path not found: ${nonexistentRoute}`);
    });
  });
});
