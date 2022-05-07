# What is Hypertool?

Hypertool is an open-source low code platform that helps you build internal
tools quickly. You can integrate apps with your databases, APIs, spreadsheets,
and other apps.

With our JavaScript-based visual development platform, build CRUD apps, forms,
dashboards, admin panels, and many more 10x faster. It is designed for developers
by developers.

## The problems with building internal tools

As developers ourselves, we have closely worked with many different teams to
build internal tools. Non-tech teams use spreadsheets to track data, use
third-party tools to analyze data, and need internal tools for business-specific
operations.

### Cannot move fast

If your company teaches science to students, spending majority of your time
building internal tools does not make sense. Instead you should focus on
providing your core services.

### Repetitive tasks

Even if the internal tool is used by a small team, authentication, authorization,
audit logging, and other such mundane features are important. Implementing all of
this requires a lot of human resources and caffeine! At a point, building internal
tools becomes repetitive and boring.

### Maintenance is a hassle

Developers are usually excited to build new projects. When they are working on
a fresh codebase they can build and iterate quickly. The problem is when the
tool is unused for a few months but is needed now, and the original developer
has moved on to another project, so there is no one to update and fix the tool.

## Advantages of Hypertool

### Build applications with powerful features

Hypertool gives you everything you need out of the box: component library,
routing, authentication, authorization, team management, audit logging, automated
deployment pipelines, and a lot more!

### Avoid vendor lock-in with Hypertool

Our community edition is open source and hosted on [GitHub](https://github.com/hypertool/hypertool). You can make changes to it and even deploy on your own infrastructure. In the long
run, if Hypertool does not meet your requirements, you can always eject your
project from Hypertool without throwing away everything.

### Ease of Maintenance

As a developer, you are responsible for organizing your source code in a way
that makes it easy to maintain your application. We designed Hypertool with
exactly this in mind.

Unlike other platforms, your application is not made up of snippets of JavaScript
scattered throughout your project. You can neatly organize your source code into
units called controllers.

### Declarative Framework

Write your business logic declaratively. This makes Hypertool easy to use and
your code is simple, which often leads to fewer bugs and more maintainability.

Hypertool takes inspiration from the amazing React framework. So if you are
familiar with React, you will feel right at home. (Of course, Hypertool can be
used by non-React wizards, too.)

## Design Choices

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
   push it to GitHub (optional), and finally deploy.

3. The selling point is not a drag-and-drop UI, but the automation of mundane tasks
   like database integration, building aesthetic interfaces, maintaining audit logs,
   deployment, hosting, authentication, and authorization.

4. Optionally, you compile Hypertool projects down to a plain React application.
   This allows us to provide users with the option to export applications if the
   need arises.
