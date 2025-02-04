## Description

Weather App is a NestJS application that serves as a wrapper for a third-party weather API and provides additional features.

## Project setup

- `copy .env.example to .env and fill the values`

```bash
$ docker compose build

$ docker compose up
```

- Server is running on http://localhost:3000
- Open API Docs are available at http://localhost:3000/swagger
- GraphQL Playground is available at http://localhost:3000/graphql

```
GraphQL Playground
{
  "authorization": "Bearer <TOKEN>"
}


curl 'http://localhost:3000/graphql' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:3000' -H 'authorization: Bearer <TOKEN>' --data-binary '{"query":"# Write your query or mutation here\n{\n  location {\n    country\n    region\n    city\n    forecast {\n      forecastday {\n        date \n        \n          hour {\n            time\n            temp_c\n            \n          }\n        \n        \n      }\n    }\n    weather {\n      temp_c\n      wind_dir\n    }\n  }\n}\n"}' --compressed
```

##### Register a new user with the following documentation:

http://localhost:3000/swagger#/Auth/AuthController_register

#####

- All the user APIs are protected by JWT token authentication.
- GrpahQL APIs are protected by JWT token authentication
- Weather and Forecast APIs are not protected by JWT token authentication

## Design Descions

#### Scheduler

- This is a monorepo project, with the scheduler and weather-app as separate apps.
- The weather-app uses the weather-api as a third-party API.
- The reason for splitting the scheduler seperately is to allow the weather-app to be scaled independently of the scheduler.
- The schedler uses bull to push jobs to the queue and a schduler to run the funtion at a specific time.
- Both the reciever and sender are using the same queue as it using redis for storing the queue.

#### Caching

- I am also using redis to cache the weather data.
- Weather Data is cached for 30 mins and the forecast for 4 hours. (Since the API gets updated every 30 mins for weather)
- everytime someone requests the weather data, we check if the data is in the cache, if not we fetch the data from the API and cache it for 30 mins. (Same for forecast)
- Due to the Scheduler, Processor runs at 1rst minute and 31rst minute of every hour. It will fetch all the locations which has been accessed in the last 1 one day and will populate the cache incase the weather data is not available in the cache

#### Authentication and Rate Limiting

- Authentication is done using JWT token.
- bcrypt is used to hash the password. The password is stored in the database as a hash.
- AuthGuard is used to protect the APIs.
- Throttler module is used to limit upto 200 requests per minute per user (based on IP).

#### Docs

- Swagger for API documentation. [http://localhost:3000/swagger]
- GraphQL Playground is available at http://localhost:3000/graphql

#### Misc

- http-create-context used to store the request and session ID accross the request lifecycle and this is being attahed the custom logger which in turn prints the ReqId and SessionId with every log/error which helps in debugging
- Exception filters used to handle the errors and return consistent error response also while logging the errors. We send requestId in the response which can be used for tracking
- TypeORM is used for database operations (Postgres DB)

#### Run tests

```bash
# unit tests
$ npm run test
```
