const activityLogs = [
    {
        context: { type: "abc" },
        component: "team_management",
        message: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ante risus, dapibus vitae ultrices a, placerat id augue. Ut at tellus nec dui hendrerit scelerisque. Donec lacinia, ex et congue fermentum, lectus enim hendrerit enim, ac sodales nisl est sed risus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce.`,
    },
    {
        context: {
            type: "xyz",
            field1: [{ x: 1 }, { y: 2 }],
            field2: { subfiled: "lorem ipsum dolor amet" },
        },
        component: "api",
        message: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ante risus, dapibus vitae ultrices a, placerat id augue. Ut at tellus nec dui hendrerit scelerisque. Donec lacinia, ex et congue fermentum, lectus enim hendrerit enim, ac sodales nisl est sed risus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce.`,
    },
    {
        component: "authorization",
        message: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ante risus, dapibus vitae ultrices a, placerat id augue. Ut at tellus nec dui hendrerit scelerisque. Donec lacinia, ex et congue fermentum, lectus enim hendrerit enim, ac sodales nisl est sed risus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce.`,
    },
];

const queryTemplates = [
    {
        name: "getUsers",
        description: "Gets the list of users who have placed an order.",
        resource: "61c9483bcd1cf99c3a211977",
        app: "61c93a931da4a79d3a109947",
        content:
            "SELECT * FROM users as u LEFT JOIN orders as o ON u.id=o.userId",
        status: "enabled",
    },
];

const appData = {
    name: "xyz",
    title: "XYZ",
    slug: "xyz",
    description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ante risus, dapibus vitae ultrices a, placerat id augue. Ut at tellus nec dui hendrerit scelerisque. Donec lacinia, ex et congue fermentum, lectus enim hendrerit enim, ac sodales nisl est sed risus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce.",
    groups: [],
    resources: [],
};

const users = [
    {
        firstName: "Jon",
        lastName: "Doe",
        description: "",
        organization: "61d6f742af737e570f340161",
        gender: "male",
        countryCode: "AFG",
        pictureURL:
            "https://i.picsum.photos/id/496/400/400.jpg?hmac=8or0mw_rugRSBRDFhLAj770EHslVmfHZEu0a_NKkxoY",
        emailAddress: "jon.doe@xyz.com",
        emailVerified: false,
        birthday: Date.now(),
        status: "activated",
        role: "owner",
        groups: ["61d6f742af737e570f340161"],
    },
    {
        firstName: "Sam",
        lastName: "Clarke",
        description: "",
        organization: "61d6f742af737e570f340161",
        gender: "male",
        countryCode: "AFG",
        pictureURL:
            "data:image/jpeg;base64,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",
        emailAddress: "sam.clarke@xyz.com",
        emailVerified: false,
        birthday: Date.now(),
        status: "activated",
        role: "owner",
        groups: ["61d6f742af737e570f340161"],
    },
];

const resources = [
    {
        name: "ecommerce",
        description:
            "This database contains all the ecommerce related information.\nThis is a new line. New update.",
        type: "mysql",
        creator: "61b34f2706fe01480acc6583",
        status: "enabled",
        mysql: {
            host: "localhost",
            port: 3306,
            databaseName: "test",
            databaseUserName: "root",
            databasePassword: "12345",
            connectUsingSSL: false,
        },
    },
];

export { activityLogs, queryTemplates, appData, users, resources };
