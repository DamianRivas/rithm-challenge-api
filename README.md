# Rithm Challenge Submission: API

My submission for the API technical challenge provided by Rithm

## Project Setup

1. Clone the application and `cd` into the project directory.

2. Install dependencies:

```
npm i
```

3. Create a .env file

```
touch .env
```

4. Copy the contents of `.sample.env` into the `.env` file

5. Populate the `.env` file with your PostgreSQL database URL's (e.g., `postgres://postgres:password@127.0.0.1:5432`)

6. Migrate the database:
```
npx knex migrate:latest
```

7. Seed the database:
```
npx knex seed:run
```

8. Run the dev server
```
npm run start:dev
```
