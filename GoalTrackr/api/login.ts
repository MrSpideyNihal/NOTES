import { Handler } from '@netlify/functions';
import { connectToDatabase } from './utils/db';
import { UserModel } from './models/User';
import { comparePassword, generateToken, setAuthCookie } from './utils/auth';

const handler: Handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        await connectToDatabase();

        const { email, password } = JSON.parse(event.body || '{}');

        if (!email || !password) {
            return { statusCode: 400, body: JSON.stringify({ message: 'Missing fields' }) };
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return { statusCode: 401, body: JSON.stringify({ message: 'Invalid credentials' }) };
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return { statusCode: 401, body: JSON.stringify({ message: 'Invalid credentials' }) };
        }

        const token = generateToken({
            _id: user._id.toString(),
            name: user.name,
            email: user.email
        });

        const response = {
            statusCode: 200,
            body: JSON.stringify({
                user: { _id: user._id, name: user.name, email: user.email },
            }),
        };

        setAuthCookie(response, token);

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Internal Server Error' }) };
    }
};

export { handler };
