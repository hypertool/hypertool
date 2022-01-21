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

export { activityLogs };
