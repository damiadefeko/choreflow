import { Document, model, Schema } from "mongoose";
import { IUser } from "./user.model";
import { IFamilyMember } from "./family-member.model";
import { ModelNames } from "../utils/constants";

export interface IFamily extends Document {
    admin: IUser;
    familyMembers: IFamilyMember[];
    inviteId: string;
}

const FamilySchema = new Schema<IFamily>({
    admin: {
        type: Schema.Types.ObjectId,
        ref: ModelNames.USER,
        required: true,
    },
    familyMembers: [{
        type: Schema.Types.ObjectId,
        ref: ModelNames.FAMILY_MEMBER,
    }],
    inviteId: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
});

export const Family = model<IFamily>(ModelNames.FAMILY, FamilySchema);
