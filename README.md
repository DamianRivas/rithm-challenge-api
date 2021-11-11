# Rithm Challenge Submission: API

My submission for the API technical challenge provided by Rithm

## Project Setup

1. Clone the application and `cd` into the project directory.

2. Install dependencies:

```shell
npm i
```

3. Copy the contents of `.sample.env` into a `.env` file
```shell
cat .sample.env > .env
```

4. Populate the `.env` file with your PostgreSQL database URL's (e.g., `postgres://user:password@127.0.0.1:5432`)

5. Migrate the database:
```
npx knex migrate:latest
```

6. Seed the database with csv data:
```
npx knex seed:run
```

7. Run the dev server
```
npm run start:dev
```

## Libraries and Technologies Used

* [Node.js](https://nodejs.org/en/)
* [express](https://expressjs.com/)
* [knex](https://knexjs.org/)
* [PostgreSQL](https://www.postgresql.org/)
* [GeoJSON.js](https://www.npmjs.com/package/geojson)
* [Geolib](https://www.npmjs.com/package/geolib)
* [Jest](https://jestjs.io/)
* [csv-parse](https://csv.js.org/parse/)
