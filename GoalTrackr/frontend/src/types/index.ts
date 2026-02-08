export type User = {
    _id: string;
    name: string;
    email: string;
};

export type GoalCategory = 'Personal' | 'Health' | 'Career' | 'Learning' | 'Finance' | 'Other';

export type GoalStatus = 'Not started' | 'In progress' | 'Completed' | 'Archived';

export type Goal = {
    _id: string;
    userId: string;
    title: string;
    description: string;
    category: GoalCategory;
    startDate: string; // ISO date string
    targetDate: string; // ISO date string
    status: GoalStatus;
    createdAt: string;
};

export type ProgressNote = {
    _id: string;
    goalId: string;
    userId: string;
    content: string;
    date: string; // ISO date string
};

export type AuthResponse = {
    user: User;
    token?: string;
};
