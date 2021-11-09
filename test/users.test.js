const request = require("supertest");

const app = require("../src/app");

const userEndpoint = "/users";
const params =
  "?fav_color=red&dist=100&origin=37.774929,-122.419416&min_age=21&max_age=29";

describe("/Users tests", () => {
  test("response should contain request metadata", async () => {
    const response = await request(app)
      .get(userEndpoint)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.metadata).toBeDefined();
  });

  describe("Request metadata", () => {
    test("should contain path and query data", async () => {
      const response = await request(app)
        .get(`${userEndpoint}${params}`)
        .set("Accept", "application/json");

      expect(response.status).toBe(200);
      expect(response.body.metadata.path).toBe(userEndpoint);
      expect(response.body.metadata.query).toBeDefined();
    });
  });
});
