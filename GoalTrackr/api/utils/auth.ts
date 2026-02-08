import jwt from 'jsonwebtoken';
import { User } from '../../shared/types';
import cookie from 'cookie';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-do-not-use-in-production';

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
};

export const generateToken = (user: User) => {
    return jwt.sign({ _id: user._id, email: user.email, name: user.name }, JWT_SECRET, {
        expiresIn: '7d',
    });
};

export const verifyToken = (token: string): User | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as User;
        return decoded;
    } catch (error) {
        return null;
    }
};

export const setAuthCookie = (res: any, token: string) => {
    const serialized = cookie.serialize('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
    });

    res.setHeader('Set-Cookie', serialized);
};

export const clearAuthCookie = (res: any) => {
    const serialized = cookie.serialize('auth_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: -1,
        path: '/',
    });

    res.setHeader('Set-Cookie', serialized);
};

// Helper to extract user from request (cookie or header)
export const getUserFromRequest = (event: any): User | null => {
    const cookies = cookie.parse(event.headers.cookie || '');
    const token = cookies.auth_token;

    if (token) {
        return verifyToken(token);
    }

    return null;
};
