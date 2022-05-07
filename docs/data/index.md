# Introduction

Hypertool allows client apps to access and manipulate data safely. This is
achieved by using resources and query templates.

A resource is a data source such as MySQL, PostgreSQL, and MongoDB. When you
create a resource, need to configure how Hypertool connects to the data source.

A query template is a read/write operation that can be executed against a
resource. When you create a query template, you associate it with a resource.
This way, when a query template is invoked, Hypertool knows where the query
template should reach.

For example, let's say you have a MySQL database called `ecommerce`, that
contains a table called `orders`. To fetch orders from the database, Hypertool
needs two pieces of information:

1. The database where the data is stored
2. How to fetch the data from the database

To tell Hypertool where the data is stored, you need to configure a resource.
Simiarly, to describe how the data is fetched, you need to create a query
template.

You can create as many resources and query templates as you like. To know more
about each particular data source, look at the relevant documentation page.
