# Working with Screens

An Hypertool app can contain one or more screens.

## Creating Screen

To create a new screen, click on the "Create New Screen" button in the Explorer tab. (If the "Screens" accordion is collapsed, you will need to expand it to find the "Create New Screen" button.) This will open the New Screen tab.

You will be asked to provide a name, title, slug, and description.

-   The name specifies a handle that uniquely identifies the screen in your app. For example, if you named a screen `home-page`, you cannot create another screen with the same name.

-   The title specifies the tab title rendered in your browser window. You can dynamically change the tab title via controllers.

-   The slug specifies the path to the screen. You can indicate dynamic segments by prepending `:` before the segment. For example, `/users/:handle` would match both `/users/samuel_rowe` and `/users/clarina_annet`. You can access the dynamic segments via your controller.

-   You can describe the functionality of the screen using the optional description field.

After filling in the details, click "Create Screen" to create the screen.

Hypertool automatically creates and associates a controller with the newly created screen. The new controller will have the same name as the screen.

That's it! You can now design the UI of the screen by using the drag-and-drop editor.
