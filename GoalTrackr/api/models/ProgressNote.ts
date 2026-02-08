import mongoose, { Schema, Document } from 'mongoose';

export interface IProgressNote extends Document {
    goalId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    content: string;
    date: Date;
}

const ProgressNoteSchema: Schema = new Schema({
    goalId: { type: Schema.Types.ObjectId, ref: 'Goal', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

export const ProgressNoteModel = mongoose.models.ProgressNote || mongoose.model<IProgressNote>('ProgressNote', ProgressNoteSchema);
