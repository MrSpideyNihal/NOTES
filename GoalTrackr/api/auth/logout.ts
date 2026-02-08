import { Handler } from '@netlify/functions';
import { clearAuthCookie } from '../utils/auth';

const handler: Handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify({ message: 'Logged out successfully' }),
    };

    clearAuthCookie(response);

    return response;
};

export { handler };
