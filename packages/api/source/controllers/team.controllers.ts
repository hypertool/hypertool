import type { IExternalTeam, TTeamPage } from "@hypertool/common";
import {
    BadRequestError,
    NotFoundError,
    TeamModel,
    constants,
    extractIds,
} from "@hypertool/common";

import joi from "joi";

const createSchema = joi.object({
    name: joi.string().max(256).allow(""),
    description: joi.string().max(512).allow(""),
    members: joi.array().items(
        joi.object({
            user: joi.string().regex(constants.identifierPattern),
            role: joi.string().valid(...constants.organizationRoles),
        }),
    ),
    apps: joi.array().items(joi.string().regex(constants.identifierPattern)),
});

const filterSchema = joi.object({
    page: joi.number().integer().default(0),
    limit: joi
        .number()
        .integer()
        .min(constants.paginateMinLimit)
        .max(constants.paginateMaxLimit)
        .default(constants.paginateMinLimit),
});

const updateSchema = joi.object({
    name: joi.string().max(256).allow(""),
    description: joi.string().max(512).allow(""),
    members: joi.array().items(
        joi.object({
            user: joi.string().regex(constants.identifierPattern),
            role: joi.string().valid(...constants.organizationRoles),
        }),
    ),
    apps: joi.array().items(joi.string().regex(constants.identifierPattern)),
});

const toExternal = (team: any): IExternalTeam => {
    const {
        id,
        _id,
        name,
        description,
        organization,
        members,
        apps,
        status,
        createdAt,
        updatedAt,
    } = team;

    return {
        id: id || _id.toString(),
        name,
        description,
        organization,
        members,
        apps: extractIds(apps),
        status,
        createdAt,
        updatedAt,
    };
};

const create = async (context, attributes): Promise<IExternalTeam> => {
    const { error, value } = createSchema.validate(attributes, {
        stripUnknown: true,
    });

    if (error) {
        throw new BadRequestError(error.message);
    }

    // Add `team` to `app.teams`.
    const newTeam = new TeamModel({
        ...value,
        status: "enabled",
    });
    await newTeam.save();

    return toExternal(newTeam);
};

const list = async (context, parameters): Promise<TTeamPage> => {
    const { error, value } = filterSchema.validate(parameters);
    if (error) {
        throw new BadRequestError(error.message);
    }

    const filters = {
        status: {
            $ne: "deleted",
        },
    };
    const { page, limit } = value;

    const teams = await (TeamModel as any).paginate(filters, {
        limit,
        page: page + 1,
        lean: true,
        leanWithId: true,
        pagination: true,
        sort: {
            updatedAt: -1,
        },
    });

    return {
        totalRecords: teams.totalDocs,
        totalPages: teams.totalPages,
        previousPage: teams.prevPage ? teams.prevPage - 1 : -1,
        nextPage: teams.nextPage ? teams.nextPage - 1 : -1,
        hasPreviousPage: teams.hasPrevPage,
        hasNextPage: teams.hasNextPage,
        records: teams.docs.map(toExternal),
    };
};

const listByIds = async (
    context,
    teamIds: string[],
): Promise<IExternalTeam[]> => {
    const unorderedTeams = await TeamModel.find({
        _id: { $in: teamIds },
        status: { $ne: "deleted" },
    }).exec();
    const object = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const team of unorderedTeams) {
        object[team._id.toString()] = team;
    }
    return teamIds.map((key) => toExternal(object[key]));
};

const getById = async (context, teamId: string): Promise<IExternalTeam> => {
    if (!constants.identifierPattern.test(teamId)) {
        throw new BadRequestError("The specified team identifier is invalid.");
    }

    // TODO: Update filters
    const filters = {
        _id: teamId,
    };
    const team = await TeamModel.findOne(filters as any).exec();

    /* We return a 404 error, if we did not find the team. */
    if (!team) {
        throw new NotFoundError(
            "Cannot find a team with the specified identifier.",
        );
    }

    return toExternal(team);
};

const update = async (
    context,
    teamId: string,
    attributes,
): Promise<IExternalTeam> => {
    if (!constants.identifierPattern.test(teamId)) {
        throw new BadRequestError("The specified team identifier is invalid.");
    }

    const { error, value } = updateSchema.validate(attributes, {
        stripUnknown: true,
    });
    if (error) {
        throw new BadRequestError(error.message);
    }

    // TODO: Update filters
    const team = await TeamModel.findOneAndUpdate(
        {
            _id: teamId,
        },
        value,
        {
            new: true,
            lean: true,
        },
    ).exec();

    if (!team) {
        throw new NotFoundError(
            "A team with the specified identifier does not exist.",
        );
    }

    return toExternal(team);
};

const remove = async (
    context,
    teamId: string,
): Promise<{ success: boolean }> => {
    if (!constants.identifierPattern.test(teamId)) {
        throw new BadRequestError("The specified team identifier is invalid.");
    }

    // TODO: Update filters
    const team = await TeamModel.findOneAndUpdate(
        {
            _id: teamId,
            status: { $ne: "deleted" },
        },
        {
            status: "deleted",
        },
        {
            new: true,
            lean: true,
        },
    );

    if (!team) {
        throw new NotFoundError(
            "A team with the specified identifier does not exist.",
        );
    }

    return { success: true };
};

export { create, list, listByIds, getById, update, remove };
