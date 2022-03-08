import { Schema, model } from "mongoose";

import type { IMembership } from "../types";
import { membershipStatuses, membershipTypes } from "../utils/constants";

const membershipSchema = new Schema(
    {
        /* An identifier that points to the User whose membership is being
         * defined by the current document.
         */
        member: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        /* An identifier that points to the User that invited the member to the
         * class specified by division.
         */
        inviter: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        /* An identifier that points to the division.
         * This attribute is polymorphic, that is, its meaning is defined based
         * on the value of type attribute. For example, if type is organization,
         * then the identifier points to an organization document. On the other
         * hand, if type is group, then the identifier points to a group document.
         */
        division: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        /* The type of membership. Valid values are as follows: organization and
         * group.
         */
        type: {
            type: String,
            enum: membershipTypes,
            required: true,
        },
        /* The status of the membership. Valid values are as follows: accepted,
         * deleted, banned, and invited.
         */
        status: {
            type: String,
            enum: membershipStatuses,
            required: true,
        },
        createdAt: { type: Date, immutable: true },
    },
    {
        timestamps: true,
    },
);

export default model<IMembership>("Membership", membershipSchema);
