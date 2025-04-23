# Chirpy (Typescript version)

Application for the Boot.dev "Learn HTTP Servers" course (typescript version).

## Getting started

Copy the `.env.template` file, and set the appropriate values for `JWT_SECRET`
and `POLKA_KEY`. You'll also need to create a postgres database and set the 
database URL. The `dev` platform variable value allows the `reset` function (see 
below).

Build the application:
```shell
npm run build
```

Run the application:
```shell
npm start
```

There is also a `dev` command to run these as a single command:
```shell
npm run dev
```

## Usage

### User and session management
Create a new user (register):
```http request
POST /api/users

{ "email": "you@example.com", "password": "super_secret" }
```

Login as an existing user:
```http request
POST /api/login

{ "email": "you@example.com", "password": "super_secret" }
```

Retrieve a refresh token:
```http request
POST /api/refresh
Authorization: Bearer [refresh_token]
```

Revoke a refresh token
```http request
POST /api/revoke
Authorization: Bearer [refresh_token]
```

Update your account (requires auth token from login):
```http request
PUT /api/users
Authorization: Bearer [token]

{ "email": "new-email@example.com", "password": "a-better-secret" }
```

### Chirps
Non-GET chirp endpoints are restricted via auth token (which is returned in the
JSON when logging in).

Create a chirp:
```http request
POST /api/chirps
Authorization: Bearer [token]

{ "body": "Something profound" }
```

Delete a chirp:
```http request
DELETE /api/chirps/:id
Authorization: Bearer [token]
```

List all chirps:
```http request
GET /api/chirps
```
Chirps may be filtered by `authorId` (user id) and sorted by creation date 
(`sort`) parameters. If no parameters given, defaults to all chirps in ascending
order.

View a chirp:
```http request
GET /api/chirps/:id
```
