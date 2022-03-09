import { constants } from "@hypertool/common";

const { genders, countryCodes, userStatuses, userRoles, appStatuses } =
    constants;

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
`;

export { types };
