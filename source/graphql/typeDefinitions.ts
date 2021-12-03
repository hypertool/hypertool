import {
    genders,
    countryCodes,
    userStatuses,
    userRoles,
} from "../utils/constants";

const typeDefinitions = `
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

export { typeDefinitions as types };
