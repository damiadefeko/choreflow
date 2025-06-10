import { Document, model, Schema } from "mongoose";
import { IUser } from "./user.model";
import { ModelNames } from "../utils/constants";
import { IFamily } from "./family.model";

export interface IFamilyMember extends Document {
    user: IUser;
    score: number;
    family: IFamily;
}

export const FamilyMemberSchema = new Schema<IFamilyMember>({
    user: {
        type: Schema.Types.ObjectId,
        ref: ModelNames.USER,
        required: true,
    },
    score: {
        type: Number,
        default: 0,
    },
    family: {
        type: Schema.Types.ObjectId,
        ref: ModelNames.FAMILY,
    },
}, {
    timestamps: true,
});

export const FamilyMember = model<IFamilyMember>(ModelNames.FAMILY_MEMBER, FamilyMemberSchema);