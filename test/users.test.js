const request = require("supertest");

const app = require("../src/app");
const knex = require("../src/db/connection");

const endpoint = "/users";

describe("GET /Users tests", () => {
  let [fav_color, dist, origin, min_age, max_age] = [
    "red",
    "100",
    "37.774929,-122.419416",
    "21",
    "29",
  ];

  beforeAll(async () => {
    await knex.migrate
      .forceFreeMigrationsLock()
      .then(() => knex.migrate.rollback(null, true))
      .then(() => knex.migrate.latest())
      .then(() => knex.seed.run());
  });

  afterAll(async () => {
    await knex.migrate.rollback(null, true).then(() => knex.destroy());
  });

  describe("should gracefully ignore invalid origin parameter", () => {
    test("invalid string", async () => {
      const params = { fav_color: "green", origin: "thisIsINVALID" };

      let results = await knex("users")
        .select("user_id")
        .where({ fav_color: params.fav_color });
      let resultCount = results.length;

      let response = await request(app)
        .get(endpoint)
        .query(params)
        .set("Accept", "application/json");

      expect(response.status).toEqual(200);
      expect(response.body.num_results).toEqual(resultCount);
      expect(response.body.results.length).toEqual(resultCount);
    });

    test("invalid latitude value", async () => {
      const params = { fav_color: "green", origin: "100,100" };

      let results = await knex("users")
        .select("user_id")
        .where({ fav_color: params.fav_color });
      let resultCount = results.length;

      let response = await request(app)
        .get(endpoint)
        .query(params)
        .set("Accept", "application/json");

      expect(response.status).toEqual(200);
      expect(response.body.num_results).toEqual(resultCount);
      expect(response.body.results.length).toEqual(resultCount);
    });

    test("invalid longitude value", async () => {
      const params = { fav_color: "green", origin: "45,200" };

      let results = await knex("users")
        .select("user_id")
        .where({ fav_color: params.fav_color });
      let resultCount = results.length;

      let response = await request(app)
        .get(endpoint)
        .query(params)
        .set("Accept", "application/json");

      expect(response.status).toEqual(200);
      expect(response.body.num_results).toEqual(resultCount);
      expect(response.body.results.length).toEqual(resultCount);
    });
  });

  describe("should gracefully handle invalid dist parameter", () => {
    test("dist as a string", async () => {
      const params = { dist: "hello", origin: "0,0" };

      let results = await knex("users")
        .select("*")
        .join("locations", "users.user_id", "locations.user_id")
        .where({ lat: 0, long: 0 });
      let resultCount = results.length;

      let response = await request(app)
        .get(endpoint)
        .query(params)
        .set("Accept", "application/json");

      expect(response.status).toEqual(200);
      expect(response.body.num_results).toEqual(resultCount);
      expect(response.body.results.length).toEqual(resultCount);
    });

    test("ignores dist if origin is not provided", async () => {
      const params = { dist: "100", fav_color };

      let results = await knex("users").select("*").where({ fav_color });
      let resultCount = results.length;

      let response = await request(app)
        .get(endpoint)
        .query(params)
        .set("Accept", "application/json");

      expect(response.status).toEqual(200);
      expect(response.body.num_results).toEqual(resultCount);
      expect(response.body.results.length).toEqual(resultCount);
    });
  });

  describe("Successful response", () => {
    test("should contain request metadata", async () => {
      const response = await request(app)
        .get(endpoint)
        .set("Accept", "application/json");

      expect(response.status).toBe(200);
      expect(response.body.metadata).toBeDefined();
    });

    describe("request metadata", () => {
      test("should contain path and query data", async () => {
        const params = { fav_color, dist, origin, min_age, max_age };

        const response = await request(app)
          .get(endpoint)
          .query(params)
          .set("Accept", "application/json");

        expect(response.status).toBe(200);
        expect(response.body.metadata.path).toBe(endpoint);
        expect(response.body.metadata.query).toMatchObject({
          fav_color,
          origin,
          dist: Number(dist),
          min_age: Number(min_age),
          max_age: Number(max_age),
        });
      });
    });

    describe("num_results", () => {
      test("should contain the correct result count", async () => {
        let params = { fav_color, dist, origin, min_age, max_age };

        let response = await request(app)
          .get(endpoint)
          .query(params)
          .set("Accept", "application/json");

        expect(response.status).toBe(200);
        expect(response.body.num_results).toBe(1);

        params = { min_age: "28", max_age: 30 };

        response = await request(app)
          .get(endpoint)
          .query(params)
          .set("Accept", "application/json");

        expect(response.status).toBe(200);
        expect(response.body.num_results).toBe(2);
      });
    });

    describe("results", () => {
      test("should be an empty array if no results are found", async () => {
        let response = await request(app)
          .get(endpoint)
          .query({ fav_color: "NOTACOLOR" })
          .set("Accept", "application/json");

        expect(response.status).toBe(200);
        expect(response.body.num_results).toBe(0);
        expect(response.body.results).toEqual(expect.arrayContaining([]));
      });

      test("should be an array of objects with type 'user'", async () => {
        let users = await knex("users").select("user_id");
        let numberOfUsers = users.length;

        let response = await request(app)
          .get(endpoint)
          .set("Accept", "application/json");

        expect(response.status).toBe(200);
        expect(response.body.results.length).toEqual(numberOfUsers);
        response.body.results.forEach((r) => expect(r.type).toEqual("user"));
      });
    });
  });
});
