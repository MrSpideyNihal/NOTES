import { Handler } from '@netlify/functions';
import { connectToDatabase } from './utils/db';
import { GoalModel } from './models/Goal';
import { getUserFromRequest } from './utils/auth';
import { GoalStatus, GoalCategory } from '../shared/types';

const handler: Handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const user = getUserFromRequest(event);
    if (!user) {
        return { statusCode: 401, body: JSON.stringify({ message: 'Unauthorized' }) };
    }

    try {
        await connectToDatabase();

        if (event.httpMethod === 'GET') {
            const goals = await GoalModel.find({ userId: user._id }).sort({ createdAt: -1 });
            return {
                statusCode: 200,
                body: JSON.stringify(goals),
            };
        }

        if (event.httpMethod === 'POST') {
            const data = JSON.parse(event.body || '{}');

            // Basic validation
            if (!data.title || !data.startDate || !data.targetDate) {
                return { statusCode: 400, body: JSON.stringify({ message: 'Missing required fields' }) };
            }

            const newGoal = await GoalModel.create({
                ...data,
                userId: user._id,
            });

            return {
                statusCode: 201,
                body: JSON.stringify(newGoal),
            };
        }

        return { statusCode: 405, body: 'Method Not Allowed' };
    } catch (error) {
        console.error('Goals API error:', error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Internal Server Error' }) };
    }
};

export { handler };
