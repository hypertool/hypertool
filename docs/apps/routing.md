# Routing

In Hypertool, your app can contain several screens. Each screen is located using
its route, that is, the slug.

## Navigating Between Screens

You can navigate between screens using the `context.navigate` function.
It has two signatures:

```typescript
interface IPath {
    /**
     * The path component in the URL, beginning with a `/`.
     */
    path: string;

    /**
     * The query string component in the URL, beginning with a `?`.
     */
    query: string;

    /**
     * A URL fragment identifier, beginning with a `#`.
     */
    hash: string;
}

/**
 * Describes a location that is the destination of some navigation.
 * It can either be a URL or pieces of a URL.
 */
type TNavigationTarget = string | Partial<IPath>;

interface TNavigateFunction {
    (target: TNavigationTarget, options?: INavigationOptions): void;
    (delta: number): void;
}
```

The first function accepts the target to navigate to, which can be a URL
or pieces of a URL (partial `IPath`). Optionally, you can specify the `replace`
and `state` values.

The second function accepts the delta, that is, the number of steps you want to
go in the history stack. For example, `context.navigate(-1)` is equivalent to
hitting the back button once.

## Accessing Path Parameters

A common requirement for apps is to pass information between different screens.
You can achieve this by using path parameters and query parameters. (Of course,
there are other ways, but we will not cover them here.)

When you create a new screen, the slug you specify determines the route of the
screen. A slug is a sequence of segments, that is, the characters between `/`.
For example, `/users/samuel_rowe` has two segments.

You can indicate dynamic segments, also known as path parameters, by prepending
`:` before the segment. You can access the dynamic segments via
`context.location.pathParams`. For example, `/users/:handle` would match both
`/users/samuel_rowe` and `/users/clarina_annet`. When the URL is `/users/clarina_annet`,
`pathParams` will contain `{ handle: "clarina_annet" }`.

## Accessing Query Parameters

You can also pass information between screens by using query parameters.
For example, in the URL `https://example.com/users?page=1&limit=20`,
`?page=1&limit=20` is the query string. Hypertool parses the query string and
stores them in `context.location.queryParams`. Unlike path parameters, you do
not have to declare them in the slug.
