const { constants } = require("../utils");

const typeDefinitions = `
    enum UserStatus {
        ${constants.userStatuses.join("\n")}
    }

    enum Gender {
        ${constants.genders.join("\n")}
    }

    enum Language {
        ${constants.languageCodes.join("\n")}
    }

    enum Country {
        ${constants.countryCodes.join("\n")}
    }

    type User {
        id: ID!
        firstName: String!
        lastName: String!
        about: String
        gender: Gender
        countryCode: Country!
        pictureURL: String
        emailAddress: String!
        emailVerified: Boolean!
        roles: [String!]!
        birthday: String
        status: UserStatus!
    }
`;

module.exports = typeDefinitions;
