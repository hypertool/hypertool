# Working with Query Templates

With query templates your application can execute operations against resources. For example, you could create a query template to fetch all the users from a MySQL table. You can create a query template in just a few clicks.

## Creating Query Template

To create a new query template, click on the "Create New Query Template" button in the Explorer tab. (If the "Query Templates" accordion is collapsed, you will need to expand it to find the "Create New Query Template" button.) This will open the New Query Template tab.

You will be asked to provide a name, an optional description, and select the resource against which the query template will be executed. Click "Next" in the bottom right to continue.

> Make sure you have create the resource before creating a new query template. You can read more about creating resources in the previous sections.

After filling in the details, you will be asked to write the content of the query template. For SQL resources, the content is basically the SQL statements that you want to execute. After writing your content, click "Create Query Template" to create the query template.

That's it! You can now invoke query templates from your controllers.
