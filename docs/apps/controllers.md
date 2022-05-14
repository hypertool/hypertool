# Controllers

Controllers allow you to implement custom business logic in JavaScript.

Each screen should be associated with a controller. You can reference every
entity in Hypertool from your controllers, including resources, query templates,
screens, nodes, and properties.

A controller is basically an object that implements callbacks that are invoked
during the lifecycle of a screen.

```js
({
    render: (context) => context.inflate("default"),
});
```

> Note: As of this writing, the object should be enclosed within parentheses.

The `render` function is invoked whenever the screen needs to be rendered.
All the callbacks in controllers receive `context` as the first argument. The
`context` object implements several functions and provides an interface for your
controllers to make requests to Hypertool.

In the above example, we used the `inflate` function, which returns an object
representing the "default" fragment created in the drag-and-drop editor. The
render function should return this node. Thus, telling Hypertool what the UI
should look like for the context.
