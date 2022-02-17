# Design Choices

Existing solutions allow you to build applications in one of the following ways:

-   **Build from scratch**

    Developers build applications from scratch. This is the most cumbersome way
    to build an application, yet the most flexible way.

-   **Low-code tools**

    Tools like [AppSmith](https://appsmith.com) and [Retool](https://retool.com)
    allow you to create applications via a drag-and-drop editor. However, you are
    expected to get your hands dirty with JavaScript and SQL to make the best out
    of it.

-   **No-code tools**

    Tools like [Internal.io](https://internal.io) and [Bubble.io](https://bubble.io)
    allow you to create applications via a drag-and-drop editor. Unlike low-code
    tools, you do not really have to code here.

Hypertool makes the best of all the three approaches to implement applications!
We provide a coding framework + platform that allows developers to build applications
quicker. Even though most non-developers find the idea of coding terrifying, that's
not really the case for developers.

Here are some advantages to Hypertool's design:

1. Multiple people can work on the same project. Since the application is written,
   VCS like Git can be used to collaborate with multiple developers.

2. The workflow fits with what most developers are already used to. You write code,
   push it to GitHub, and finally deploy.

3. The selling point is not a drag-and-drop UI, but the automation of mundane tasks
   like database integration, building aesthetic interfaces, maintaining audit logs,
   deployment, hosting, authentication, and authorization.

4. Since we use a markup language, we compile it down to a plain React application
   before deploying. This allows us to provide users with the option to export
   applications if the need arises.
