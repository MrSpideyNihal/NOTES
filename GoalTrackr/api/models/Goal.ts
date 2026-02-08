import mongoose, { Schema, Document } from 'mongoose';
import { GoalCategory, GoalStatus } from '../../shared/types';

export interface IGoal extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    description: string;
    category: GoalCategory;
    startDate: Date;
    targetDate: Date;
    status: GoalStatus;
    createdAt: Date;
}

const GoalSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    category: {
        type: String,
        enum: ['Personal', 'Health', 'Career', 'Learning', 'Finance', 'Other'],
        default: 'Personal'
    },
    startDate: { type: Date, required: true },
    targetDate: { type: Date, required: true },
    status: {
        type: String,
        enum: ['Not started', 'In progress', 'Completed', 'Archived'],
        default: 'Not started'
    },
    createdAt: { type: Date, default: Date.now },
});

export const GoalModel = mongoose.models.Goal || mongoose.model<IGoal>('Goal', GoalSchema);
