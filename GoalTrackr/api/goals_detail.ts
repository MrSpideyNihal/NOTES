import { Handler } from '@netlify/functions';
import { connectToDatabase } from '../utils/db';
import { GoalModel } from '../models/Goal';
import { getUserFromRequest } from '../utils/auth';

const handler: Handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const user = getUserFromRequest(event);
    if (!user) {
        return { statusCode: 401, body: JSON.stringify({ message: 'Unauthorized' }) };
    }

    const id = event.queryStringParameters?.id;
    if (!id) {
        return { statusCode: 400, body: JSON.stringify({ message: 'Missing Goal ID' }) };
    }

    try {
        await connectToDatabase();

        const goal = await GoalModel.findOne({ _id: id, userId: user._id });

        if (!goal) {
            return { statusCode: 404, body: JSON.stringify({ message: 'Goal not found' }) };
        }

        if (event.httpMethod === 'GET') {
            return {
                statusCode: 200,
                body: JSON.stringify(goal),
            };
        }

        if (event.httpMethod === 'PUT') {
            const data = JSON.parse(event.body || '{}');

            // Prevent updating immutable fields if necessary, or just spread
            // Ideally validation here
            Object.assign(goal, data);
            await goal.save();

            return {
                statusCode: 200,
                body: JSON.stringify(goal),
            };
        }

        if (event.httpMethod === 'DELETE') {
            await GoalModel.deleteOne({ _id: id });
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Goal deleted' }),
            };
        }

        return { statusCode: 405, body: 'Method Not Allowed' };

    } catch (error) {
        console.error('Goal Detail API error:', error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Internal Server Error' }) };
    }
};

export { handler };
