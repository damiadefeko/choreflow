import { Document, model, Schema } from "mongoose";
import { IChoreWeek } from "./chore-week.model";
import { ModelNames } from "../utils/constants";

export interface IChore extends Document {
    choreName: string;
    choreDescription: string;
    chorePoints: number;
    choreDeadline: Date;
    choreWeek: IChoreWeek;
}

const ChoreSchema = new Schema<IChore>({
    choreName: {
        type: String,
        required: true,
    },
    choreDescription: {
        type: String,
        required: true,
    },
    chorePoints: {
        type: Number,
        required: true,
    },
    choreDeadline: {
        type: Date,
        required: true,
    },
    choreWeek: {
        type: Schema.Types.ObjectId,
        ref: ModelNames.CHORE_WEEK,
        required: true,
    },
});

export const Chore = model<IChore>(ModelNames.CHORE, ChoreSchema)