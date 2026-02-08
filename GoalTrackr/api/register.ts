import { Handler } from '@netlify/functions';
import { connectToDatabase } from './utils/db';
import { UserModel } from './models/User';
import { hashPassword, generateToken, setAuthCookie } from './utils/auth';

const handler: Handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        await connectToDatabase();

        const { email, password, name } = JSON.parse(event.body || '{}');

        if (!email || !password || !name) {
            return { statusCode: 400, body: JSON.stringify({ message: 'Missing fields' }) };
        }

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return { statusCode: 409, body: JSON.stringify({ message: 'User already exists' }) };
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await UserModel.create({
            email,
            password: hashedPassword,
            name,
        });

        const token = generateToken({
            _id: newUser._id.toString(),
            name: newUser.name,
            email: newUser.email
        });

        const response = {
            statusCode: 201,
            body: JSON.stringify({
                user: { _id: newUser._id, name: newUser.name, email: newUser.email },
            }),
        };

        setAuthCookie(response, token);

        return response;
    } catch (error) {
        console.error('Register error:', error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Internal Server Error' }) };
    }
};

export { handler };
