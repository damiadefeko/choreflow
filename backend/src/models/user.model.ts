import { Document, model, Schema } from "mongoose";
import passportLocalMongoose from 'passport-local-mongoose'
import { ModelNames } from "../utils/constants";

interface IUser extends Document {
    isAdmin: boolean;
    email: string;
}

export const UserSchema = new Schema<IUser>({
    isAdmin: {
        type: Boolean,
        default: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
}, {
    timestamps: true,
});

UserSchema.plugin(passportLocalMongoose, { userNameField: 'email' });

export const User = model<IUser>(ModelNames.USER, UserSchema);