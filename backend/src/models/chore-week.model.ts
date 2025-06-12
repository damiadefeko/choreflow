import { Document, model, Schema } from "mongoose";
import { ModelNames } from "../utils/constants";
import { IFamily } from "./family.model";
import { getStartOfWeek } from "../utils/helper";

export interface IChoreWeek extends Document {
    family: IFamily;
    weekStart: Date;
    weekPrize: string;
}

const ChoreWeekSchema = new Schema<IChoreWeek>({
    family: {
        type: Schema.Types.ObjectId,
        ref: ModelNames.FAMILY,
        required: true,
    },
    weekStart: {
        type: Date,
        required: true,
        default: getStartOfWeek,
    },
    weekPrize: {
        type: String,
        default: "",
    },
});

export const ChoreWeek = model<IChoreWeek>(ModelNames.CHORE_WEEK, ChoreWeekSchema);