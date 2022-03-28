import { constants } from "@hypertool/common";

const {
    genders,
    countryCodes,
    userStatuses,
    userRoles,
    appStatuses,
    resourceTypes,
    resourceStatuses,
    organizationStatuses,
    teamStatuses,
    queryStatuses,
    componentOrigins,
    queryResultFormats,
    commentStatuses,
    conversationStatuses,
    controllerStatuses,
    controllerLanguages,
    screenStatuses,
    organizationRoles,
    teamRoles,
} = constants;

const types = `
    scalar Date

    enum Gender {
        ${genders.join("\n")}
    }

    enum Country {
        ${countryCodes.join("\n")}
    }

    enum UserStatus {
        ${userStatuses.join("\n")}
    }

    enum UserRole {
        ${userRoles.join("\n")}
    }

    enum AppStatus {
        ${appStatuses.join("\n")}
    }

    type User {
        id: ID!
        firstName: String!
        lastName: String!
        description: String!
        # Organizations points to User directly, making each other mutually recursive.
        # Therefore, we flatten the data structure here.
        organizations: [ID!]!
        apps: [ID!]!
        gender: Gender
        countryCode: Country
        pictureURL: String
        emailAddress: String!
        emailVerified: Boolean!
        birthday: Date
        status: UserStatus!
        createdAt: Date!
        updatedAt: Date!
    }

    type Session {
        jwtToken: String!
        user: User!
        createdAt: Date!
    }

    type UserPage {
        totalRecords: Int!
        totalPages: Int!
        previousPage: Int!
        nextPage: Int!
        hasPreviousPage: Int!
        hasNextPage: Int!
        records: [User!]!
    }

    enum OrganizationStatus {
        ${organizationStatuses.join("\n")}
    }

    enum OrganizationRole {
        ${organizationRoles.join("\n")}
    }

    type OrganizationMember {
        user: ID!
        role: OrganizationRole!
    }

    input OrganizationMemberInput {
        user: ID!
        role: OrganizationRole!
    }

    type Organization {
        id: ID!
        name: String!
        title: String!
        description: String!
        members: [OrganizationMember!]!
        apps: [ID!]!
        teams: [ID!]!
        status: OrganizationStatus!
        createdAt: Date!
        updatedAt: Date!
    }

    type OrganizationPage {
        totalRecords: Int!
        totalPages: Int!
        previousPage: Int!
        nextPage: Int!
        hasPreviousPage: Int!
        hasNextPage: Int!
        records: [Organization!]!
    }

    enum ResourceType {
        ${resourceTypes.join("\n")}
    }

    enum ResourceStatus {
        ${resourceStatuses.join("\n")}
    }

    input MySQLConfigurationInput {
        host: String!
        port: Int!
        databaseName: String!
        databaseUserName: String!
        databasePassword: String!
        connectUsingSSL: Boolean!
    }

    input PostgresConfigurationInput {
        host: String!
        port: Int!
        databaseName: String!
        databaseUserName: String!
        databasePassword: String!
        connectUsingSSL: Boolean!
    }

    input MongoDBConfigurationInput {
        host: String!
        port: Int!
        databaseName: String!
        databaseUserName: String!
        databasePassword: String!
        connectUsingSSL: Boolean!
    }

    input BigQueryConfigurationInput {
        key: String!
    }

    input GoogleAuthInput {
        enabled: Boolean!
        clientId: String!
        secret: String!
    }

    input AuthServicesInput {
        googleAuth: GoogleAuthInput
    }

    input CoordinatesInput {
        x: Int!
        y: Int!
    }

    type GoogleAuth {
        enabled: Boolean!
        clientId: String!
        secret: String!
    }

    type AuthServices {
        googleAuth: GoogleAuth
    }

    type MySQLConfiguration {
        host: String!
        port: Int!
        databaseName: String!
        databaseUserName: String!
        databasePassword: String!
        connectUsingSSL: Boolean!
    }

    type PostgresConfiguration {
        host: String!
        port: Int!
        databaseName: String!
        databaseUserName: String!
        databasePassword: String!
        connectUsingSSL: Boolean!
    }

    type MongoDBConfiguration {
        host: String!
        port: Int!
        databaseName: String!
        databaseUserName: String!
        databasePassword: String!
        connectUsingSSL: Boolean!
    }

    type BigQueryConfiguration {
        key: String!
    }

    type Resource {
        id: ID!
        name: String!
        description: String!
        creator: User!
        type: ResourceType!
        status: ResourceStatus!
        mysql: MySQLConfiguration
        postgres: PostgresConfiguration
        mongodb: MongoDBConfiguration
        bigquery: BigQueryConfiguration
        createdAt: Date!
        updatedAt: Date!
    }

    type ResourcePage {
        totalRecords: Int!
        totalPages: Int!
        previousPage: Int!
        nextPage: Int!
        hasPreviousPage: Int!
        hasNextPage: Int!
        records: [Resource!]!
    }

    enum QueryResultFormats {
        ${queryResultFormats.join("\n")}
    }

    type App {
        id: ID!
        name: String!
        title: String!
        slug: String!
        description: String!
        # Resource points to App directly, making each other mutually recursive.
        # Therefore, we flatten the data structure here.
        resources: [ID!]!
        creator: User!
        screens: [Screen!]!
        status: AppStatus!
        createdAt: Date!
        updatedAt: Date!
        authServices: AuthServices
    }

    type AppPage {
        totalRecords: Int!
        totalPages: Int!
        previousPage: Int!
        nextPage: Int!
        hasPreviousPage: Int!
        hasNextPage: Int!
        records: [App!]!
    }

    enum TeamStatus {
        ${teamStatuses.join("\n")}
    }

    enum TeamRole {
        ${teamRoles.join("\n")}
    }

    type TeamMember {
        user: ID!
        role: TeamRole!
    }

    input TeamMemberInput {
        user: ID!
        role: TeamRole!
    }

    type Team {
        id: ID!
        name: String!
        description: String!
        organization: ID!
        members: [TeamMember!]!
        apps: [App!]!
        status: TeamStatus!
        createdAt: Date!
        updatedAt: Date!
    }

    type TeamPage {
        totalRecords: Int!
        totalPages: Int!
        previousPage: Int!
        nextPage: Int!
        hasPreviousPage: Int!
        hasNextPage: Int!
        records: [Team!]!
    }

    enum QueryStatus {
        ${queryStatuses.join("\n")}
    }

    type QueryTemplate {
        id: ID!
        name: String!
        description: String!
        # Resource does not point to QueryTemplate directly, making each other not mutually 
        # recursive. Therefore, we don't have to flatten the data structure here.
        resource: Resource!
        # App points to QueryTemplate directly, making each other mutually recursive. But since 
        # queries is flattened in App, we can use the aggregate type here.         
        app: App!
        content: String!
        status: QueryStatus!
        createdAt: Date!
        updatedAt: Date!
    }

    type QueryTemplatePage {
        totalRecords: Int!
        totalPages: Int!
        previousPage: Int!
        nextPage: Int!
        hasPreviousPage: Int!
        hasNextPage: Int!
        records: [QueryTemplate!]!
    }

    type RemoveResult {
        success: Boolean!
    }

    enum ComponentOrigin {
        ${componentOrigins.join("\n")}
    }

    type ActivityLog {
        id: ID!
        message: String!
        component: ComponentOrigin!
        context: GraphQLJSON
        createdAt: Date!
        updatedAt: Date!
    }

    type ActivityLogPage {
        totalRecords: Int!
        totalPages: Int!
        previousPage: Int!
        nextPage: Int!
        hasPreviousPage: Int!
        hasNextPage: Int!
        records: [ActivityLog!]!
    }

    type QueryResult {
        result: GraphQLJSON,
        error: GraphQLJSON,
    }

    type Deployment {
        id: ID!
        app: App!
        createdAt: Date!
        updatedAt: Date!
    }

    type GenerateSignedURLsResult {
        signedURLs: [String!]!
        deployment: Deployment!
    }

    enum CommentStatuses {
        ${commentStatuses.join("\n")}
    }

    enum ConversationStatuses {
        ${conversationStatuses.join("\n")}
    }   

    type Comment {
        id: ID!
        author: ID!
        content: String!
        edited: Boolean!
        status: CommentStatuses!
        conversation: ID!
    }

    type CommentPage {
        totalRecords: Int!
        totalPages: Int!
        previousPage: Int!
        nextPage: Int!
        hasPreviousPage: Int!
        hasNextPage: Int!
        records: [Comment!]!
    }

    type Coordinates {
        x: Int!
        y: Int!
    }

    type Conversation {
        id: ID!
        app: ID!
        page: ID!
        coordinates: Coordinates!
        taggedUsers: [ID!]!
        comments: [ID!]!
        status: ConversationStatuses!
    }

    type ConversationPage {
        totalRecords: Int!
        totalPages: Int!
        previousPage: Int!
        nextPage: Int!
        hasPreviousPage: Int!
        hasNextPage: Int!
        records: [Conversation!]!
    }

    enum ScreenStatus {
        ${screenStatuses.join("\n")}
    }

    type Screen {
        id: ID!
        app: App!
        name: String!
        title: String!
        description: String!
        slug: String!
        content: String!
        controller: Controller!
        status: ScreenStatus!
        createdAt: Date!
        updatedAt: Date!
    }

    type ScreenPage {
        totalRecords: Int!
        totalPages: Int!
        previousPage: Int!
        nextPage: Int!
        hasPreviousPage: Int!
        hasNextPage: Int!
        records: [Screen!]!
    }

    enum ControllerStatus {
        ${controllerStatuses.join("\n")}
    }

    enum ControllerLanguage {
        ${controllerLanguages.join("\n")}
    }

    type ControllerPatch {
        author: User!
        content: String!
        createdAt: Date!
    }

    type Controller {
        id: ID!
        name: String!
        description: String!
        language: ControllerLanguage!
        creator: User!
        patches: [ControllerPatch!]!
        patched: String!
        status: ControllerStatus!
        createdAt: Date!
        updatedAt: Date!
    }

    type ControllerPage {
        totalRecords: Int!
        totalPages: Int!
        previousPage: Int!
        nextPage: Int!
        hasPreviousPage: Int!
        hasNextPage: Int!
        records: [Controller!]!
    }

    input ControllerPatchInput {
        author: ID!
        content: String!
    }

    scalar GraphQLJSON
`;

export { types };
