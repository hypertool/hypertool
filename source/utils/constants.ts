// eslint-disable-next-line camelcase
import { by639_1 } from "iso-language-codes";

const tuple = <T extends string[]>(...values: T) => values;

const paginateMaxLimit = 250;
const paginateMinLimit = 20;

const genders = tuple("male", "female", "other");

const languageCodes = Object.keys(by639_1);

const httpStatuses = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};

const countryCodes = tuple(
    "AFG", // Afghanistan
    "ALB", // Albania
    "DZA", // Algeria
    "ASM", // American Samoa
    "AND", // Andorra
    "AGO", // Angola
    "AIA", // Anguilla
    "ATA", // Antarctica
    "ATG", // Antigua and Barbuda
    "ARG", // Argentina
    "ARM", // Armenia
    "ABW", // Aruba
    "AUS", // Australia
    "AUT", // Austria
    "AZE", // Azerbaijan
    "BHS", // Bahamas (the)
    "BHR", // Bahrain
    "BGD", // Bangladesh
    "BRB", // Barbados
    "BLR", // Belarus
    "BEL", // Belgium
    "BLZ", // Belize
    "BEN", // Benin
    "BMU", // Bermuda
    "BTN", // Bhutan
    "BOL", // Bolivia (Plurinational State of)
    "BES", // Bonaire, Sint Eustatius and Saba
    "BIH", // Bosnia and Herzegovina
    "BWA", // Botswana
    "BVT", // Bouvet Island
    "BRA", // Brazil
    "IOT", // British Indian Ocean Territory (the)
    "BRN", // Brunei Darussalam
    "BGR", // Bulgaria
    "BFA", // Burkina Faso
    "BDI", // Burundi
    "CPV", // Cabo Verde
    "KHM", // Cambodia
    "CMR", // Cameroon
    "CAN", // Canada
    "CYM", // Cayman Islands (the)
    "CAF", // Central African Republic (the)
    "TCD", // Chad
    "CHL", // Chile
    "CHN", // China
    "CXR", // Christmas Island
    "CCK", // Cocos (Keeling) Islands (the)
    "COL", // Colombia
    "COM", // Comoros (the)
    "COD", // Congo (the Democratic Republic of the)
    "COG", // Congo (the)
    "COK", // Cook Islands (the)
    "CRI", // Costa Rica
    "HRV", // Croatia
    "CUB", // Cuba
    "CUW", // Curaçao
    "CYP", // Cyprus
    "CZE", // Czechia
    "CIV", // Côte d'Ivoire
    "DNK", // Denmark
    "DJI", // Djibouti
    "DMA", // Dominica
    "DOM", // Dominican Republic (the)
    "ECU", // Ecuador
    "EGY", // Egypt
    "SLV", // El Salvador
    "GNQ", // Equatorial Guinea
    "ERI", // Eritrea
    "EST", // Estonia
    "SWZ", // Eswatini
    "ETH", // Ethiopia
    "FLK", // Falkland Islands (the) [Malvinas]
    "FRO", // Faroe Islands (the)
    "FJI", // Fiji
    "FIN", // Finland
    "FRA", // France
    "GUF", // French Guiana
    "PYF", // French Polynesia
    "ATF", // French Southern Territories (the)
    "GAB", // Gabon
    "GMB", // Gambia (the)
    "GEO", // Georgia
    "DEU", // Germany
    "GHA", // Ghana
    "GIB", // Gibraltar
    "GRC", // Greece
    "GRL", // Greenland
    "GRD", // Grenada
    "GLP", // Guadeloupe
    "GUM", // Guam
    "GTM", // Guatemala
    "GGY", // Guernsey
    "GIN", // Guinea
    "GNB", // Guinea-Bissau
    "GUY", // Guyana
    "HTI", // Haiti
    "HMD", // Heard Island and McDonald Islands
    "VAT", // Holy See (the)
    "HND", // Honduras
    "HKG", // Hong Kong
    "HUN", // Hungary
    "ISL", // Iceland
    "IND", // India
    "IDN", // Indonesia
    "IRN", // Iran (Islamic Republic of)
    "IRQ", // Iraq
    "IRL", // Ireland
    "IMN", // Isle of Man
    "ISR", // Israel
    "ITA", // Italy
    "JAM", // Jamaica
    "JPN", // Japan
    "JEY", // Jersey
    "JOR", // Jordan
    "KAZ", // Kazakhstan
    "KEN", // Kenya
    "KIR", // Kiribati
    "PRK", // Korea (the Democratic People's Republic of)
    "KOR", // Korea (the Republic of)
    "KWT", // Kuwait
    "KGZ", // Kyrgyzstan
    "LAO", // Lao People's Democratic Republic (the)
    "LVA", // Latvia
    "LBN", // Lebanon
    "LSO", // Lesotho
    "LBR", // Liberia
    "LBY", // Libya
    "LIE", // Liechtenstein
    "LTU", // Lithuania
    "LUX", // Luxembourg
    "MAC", // Macao
    "MDG", // Madagascar
    "MWI", // Malawi
    "MYS", // Malaysia
    "MDV", // Maldives
    "MLI", // Mali
    "MLT", // Malta
    "MHL", // Marshall Islands (the)
    "MTQ", // Martinique
    "MRT", // Mauritania
    "MUS", // Mauritius
    "MYT", // Mayotte
    "MEX", // Mexico
    "FSM", // Micronesia (Federated States of)
    "MDA", // Moldova (the Republic of)
    "MCO", // Monaco
    "MNG", // Mongolia
    "MNE", // Montenegro
    "MSR", // Montserrat
    "MAR", // Morocco
    "MOZ", // Mozambique
    "MMR", // Myanmar
    "NAM", // Namibia
    "NRU", // Nauru
    "NPL", // Nepal
    "NLD", // Netherlands (the)
    "NCL", // New Caledonia
    "NZL", // New Zealand
    "NIC", // Nicaragua
    "NER", // Niger (the)
    "NGA", // Nigeria
    "NIU", // Niue
    "NFK", // Norfolk Island
    "MNP", // Northern Mariana Islands (the)
    "NOR", // Norway
    "OMN", // Oman
    "PAK", // Pakistan
    "PLW", // Palau
    "PSE", // Palestine, State of
    "PAN", // Panama
    "PNG", // Papua New Guinea
    "PRY", // Paraguay
    "PER", // Peru
    "PHL", // Philippines (the)
    "PCN", // Pitcairn
    "POL", // Poland
    "PRT", // Portugal
    "PRI", // Puerto Rico
    "QAT", // Qatar
    "MKD", // Republic of North Macedonia
    "ROU", // Romania
    "RUS", // Russian Federation (the)
    "RWA", // Rwanda
    "REU", // Réunion
    "BLM", // Saint Barthélemy
    "SHN", // Saint Helena, Ascension and Tristan da Cunha
    "KNA", // Saint Kitts and Nevis
    "LCA", // Saint Lucia
    "MAF", // Saint Martin (French part)
    "SPM", // Saint Pierre and Miquelon
    "VCT", // Saint Vincent and the Grenadines
    "WSM", // Samoa
    "SMR", // San Marino
    "STP", // Sao Tome and Principe
    "SAU", // Saudi Arabia
    "SEN", // Senegal
    "SRB", // Serbia
    "SYC", // Seychelles
    "SLE", // Sierra Leone
    "SGP", // Singapore
    "SXM", // Sint Maarten (Dutch part)
    "SVK", // Slovakia
    "SVN", // Slovenia
    "SLB", // Solomon Islands
    "SOM", // Somalia
    "ZAF", // South Africa
    "SGS", // South Georgia and the South Sandwich Islands
    "SSD", // South Sudan
    "ESP", // Spain
    "LKA", // Sri Lanka
    "SDN", // Sudan (the)
    "SUR", // Suriname
    "SJM", // Svalbard and Jan Mayen
    "SWE", // Sweden
    "CHE", // Switzerland
    "SYR", // Syrian Arab Republic
    "TWN", // Taiwan
    "TJK", // Tajikistan
    "TZA", // Tanzania, United Republic of
    "THA", // Thailand
    "TLS", // Timor-Leste
    "TGO", // Togo
    "TKL", // Tokelau
    "TON", // Tonga
    "TTO", // Trinidad and Tobago
    "TUN", // Tunisia
    "TUR", // Turkey
    "TKM", // Turkmenistan
    "TCA", // Turks and Caicos Islands (the)
    "TUV", // Tuvalu
    "UGA", // Uganda
    "UKR", // Ukraine
    "ARE", // United Arab Emirates (the)
    "GBR", // United Kingdom of Great Britain and Northern Ireland (the)
    "UMI", // United States Minor Outlying Islands (the)
    "USA", // United States of America (the)
    "URY", // Uruguay
    "UZB", // Uzbekistan
    "VUT", // Vanuatu
    "VEN", // Venezuela (Bolivarian Republic of)
    "VNM", // Viet Nam
    "VGB", // Virgin Islands (British)
    "VIR", // Virgin Islands (U.S.)
    "WLF", // Wallis and Futuna
    "ESH", // Western Sahara
    "YEM", // Yemen
    "ZMB", // Zambia
    "ZWE", // Zimbabwe
    "ALA" // Åland Islands
);

const identifierPattern = /^[a-z0-9]{24}$/;

const userStatuses = tuple("invited", "cancelled", "activated", "removed");

const userRoles = tuple("owner", "developer", "viewer");

const organizationStatuses = tuple("active", "deleted", "banned");

const groupTypes = tuple("default", "custom");

const appStatuses = tuple("private", "public", "deleted", "archived", "banned");

const resourceStatuses = tuple("enabled", "disabled", "deleted", "banned");

const resourceTypes = tuple(
    // Databases
    "mysql",
    "postgres",
    "microsoft_sql",
    "mongodb",
    "cassandra",
    "cosmosdb",
    "amazon_redshift",
    "amazon_athena",
    "bigquery",
    "elasticsearch",
    "couchdb",
    "rethinkdb",
    "snowflake",
    "denodo",
    "redis",
    "dynamodb",

    // APIs
    "rest_api",
    "graphql",
    "firebase",
    "stripe",
    "twilio",
    "github",
    "google_sheets",
    "salesforce",
    "sendgrid",
    "amazon_s3",
    "google_cloud_storage",
    "datadog",
    "lambda",
    "openapi",
    "smtp",
    "slack",
    "asana",
    "jira",
    "close",
    "bigid",
    "basecamp",
    "onesignal",
    "front",
    "google_maps",
    "circleci"
);

const groupStatuses = tuple("enabled", "disabled", "deleted", "banned");

const queryStatuses = tuple("enabled", "disabled", "deleted", "banned");

const queryLifecycleTypes = tuple("static", "dynamic");

export {
    paginateMaxLimit,
    paginateMinLimit,
    httpStatuses,
    languageCodes,
    genders,
    countryCodes,
    identifierPattern,
    userStatuses,
    userRoles,
    organizationStatuses,
    appStatuses,
    resourceStatuses,
    resourceTypes,
    groupTypes,
    groupStatuses,
    queryStatuses,
    queryLifecycleTypes,
};
