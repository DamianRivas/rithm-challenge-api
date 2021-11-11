# Rithm Challenge Submission: API

The backend for my submission for the API technical challenge provided by Rithm. Check out the client [here](https://github.com/DamianRivas/rithm-challenge)

## Project Setup

1. Clone the application and `cd` into the project directory.

2. Install dependencies:

```console
npm i
```

3. Copy the contents of `.sample.env` into a `.env` file
```console
cat .sample.env > .env
```

4. Populate the `.env` file with your PostgreSQL database URL's (e.g., `postgres://user:password@127.0.0.1:5432`)

5. Migrate the database:
```console
npx knex migrate:latest
```

6. Seed the database with csv data:
```console
npx knex seed:run
```

7. Run the dev server
```console
npm run start:dev
```

### Tests

To run tests, make sure the test database URL is populated in the `.env` file and run `npm test`

## Libraries and Technologies Used

* [Node.js](https://nodejs.org/en/)
* [express](https://expressjs.com/)
* [knex](https://knexjs.org/)
* [PostgreSQL](https://www.postgresql.org/)
* [GeoJSON.js](https://www.npmjs.com/package/geojson)
* [Geolib](https://www.npmjs.com/package/geolib)
* [Jest](https://jestjs.io/)
* [csv-parse](https://csv.js.org/parse/)

## To-Do

* Support API pagination
  * First iteration: SQL LIMIT + OFFSET
* Security
  * SQL Injection
* Tests
  * Code coverage
