const { constants } = require("../utils");

const typeDefinitions = `
    enum Gender {
        ${constants.genders.join("\n")}
    }

    enum Country {
        ${constants.countryCodes.join("\n")}
    }

    enum UserStatus {
        ${constants.userStatuses.join("\n")}
    }

    enum UserRole {
        ${constants.userRoles.join("\n")}
    }

    type User {
        id: ID!
        firstName: String!
        lastName: String!
        description: String!
        # Organization points to User directly, making each other mutually recursive.
        # Therefore, we flatten the data structure here.
        organization: ID!
        gender: Gender
        countryCode: Country
        pictureURL: String
        emailAddress: String!
        emailVerified: Boolean!
        birthday: Date
        status: UserStatus!
        role: UserRole!
        # Group points to User directly, making each other mutually recursive.
        # Therefore, we flatten the data structure here.
        groups: [ID!]!
        createdAt: Date!
        updatedAt: Date!
    }
`;

module.exports = typeDefinitions;
