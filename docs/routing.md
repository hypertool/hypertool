Hypertool borrows ideas for its router from NextJS.

Files in the `screens` directory with `.jsx`, `.tsx`, and `.htx` extensions are
automatically recognized as routes. When you add a new file, it is available as
a route in your application without any configuration.

Examples:
`screens/login.tsx` → `/login`

`screens/users.tsx` → `/users`

`screens/preferences.jsx` → `/preferences`

## Directory Roots

Clarity considers index files as the root of directories. `screens/index.tsx`
becomes the root of your application, which is `/`. Similarly,
`screens/users/index.tsx` would map to `/users`.

## Nested Routes

You can nest files in directories to create routes with multiple segments.

For example, `screens/ visitor/auth/login.tsx` maps to `/visitor/auth/login`.

## Dynamic Routes

For routing dynamic segments, you can use the `@segment` syntax. This allows
you to capture dynamic segments in named parameters.

For example, `screens/users/@userId` maps to `/users/:userId`, matching routes
like `/users/507f1f77bcf86cd799439011`, `/users/507f191e810c19729de860ea`, and
so on.

## Accessing Route Details

The `useRoute` hook provides access to the current route details. It returns
`Route`, which includes the following details:

-   path
-   query
-   params
