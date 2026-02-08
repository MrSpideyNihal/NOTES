import { Handler } from '@netlify/functions';
import { connectToDatabase } from './utils/db';
import { ProgressNoteModel } from './models/ProgressNote';
import { GoalModel } from './models/Goal';
import { getUserFromRequest } from './utils/auth';

const handler: Handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const user = getUserFromRequest(event);
    if (!user) {
        return { statusCode: 401, body: JSON.stringify({ message: 'Unauthorized' }) };
    }

    // goalId can be passed via query string (for POST/GET list)
    // or noteId for DELETE?
    // User asked for: api/progress/[goalId].ts
    // So likely: GET /api/progress/:goalId -> List notes
    // POST /api/progress/:goalId -> Add note
    // DELETE -> "Delete individual notes". This might need /api/progress/note/:noteId or query param.
    // I'll support DELETE with ?noteId=...

    const goalId = event.queryStringParameters?.goalId;
    const noteId = event.queryStringParameters?.noteId; // For delete

    try {
        await connectToDatabase();

        if (event.httpMethod === 'GET') {
            if (goalId) {
                const notes = await ProgressNoteModel.find({ goalId, userId: user._id }).sort({ date: -1 });
                return { statusCode: 200, body: JSON.stringify(notes) };
            }

            const limit = event.queryStringParameters?.limit ? parseInt(event.queryStringParameters.limit) : 10;
            const notes = await ProgressNoteModel.find({ userId: user._id })
                .sort({ date: -1 })
                .limit(limit)
                .populate('goalId', 'title');

            return { statusCode: 200, body: JSON.stringify(notes) };
        }

        if (event.httpMethod === 'POST') {
            if (!goalId) return { statusCode: 400, body: 'Missing goalId' };
            const { content } = JSON.parse(event.body || '{}');
            if (!content) return { statusCode: 400, body: 'Missing content' };

            // Verify goal belongs to user
            const goal = await GoalModel.findOne({ _id: goalId, userId: user._id });
            if (!goal) return { statusCode: 404, body: 'Goal not found' };

            const note = await ProgressNoteModel.create({
                goalId,
                userId: user._id,
                content,
                date: new Date(),
            });

            return { statusCode: 201, body: JSON.stringify(note) };
        }

        if (event.httpMethod === 'DELETE') {
            // Logic: if noteId is present, delete that note.
            if (!noteId) return { statusCode: 400, body: 'Missing noteId for delete' };

            const note = await ProgressNoteModel.findOne({ _id: noteId, userId: user._id });
            if (!note) return { statusCode: 404, body: 'Note not found' };

            await ProgressNoteModel.deleteOne({ _id: noteId });
            return { statusCode: 200, body: JSON.stringify({ message: 'Note deleted' }) };
        }

        return { statusCode: 405, body: 'Method Not Allowed' };

    } catch (error) {
        console.error('Progress API error:', error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Internal Server Error' }) };
    }
};

export { handler };
