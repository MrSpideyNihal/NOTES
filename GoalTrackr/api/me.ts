import { Handler } from '@netlify/functions';
import { connectToDatabase } from './utils/db';
import { getUserFromRequest } from './utils/auth';

const handler: Handler = async (event, context) => {
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        // Check auth
        const user = getUserFromRequest(event);
        if (!user) {
            return { statusCode: 401, body: JSON.stringify({ message: 'Unauthorized' }) };
        }

        // Ideally fetch fresh user data from DB, but token data is usually enough or token is stateless
        // Let's verify user still exists in DB just in case
        await connectToDatabase();
        // const dbUser = await UserModel.findById(user._id); // Optional check

        return {
            statusCode: 200,
            body: JSON.stringify({ user }),
        };
    } catch (error) {
        console.error('Me error:', error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Internal Server Error' }) };
    }
};

export { handler };
