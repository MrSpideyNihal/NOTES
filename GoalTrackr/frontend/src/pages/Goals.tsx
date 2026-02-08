import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { Goal } from '../types';
import GoalCard from '../components/GoalCard';
import { PlusIcon } from '@heroicons/react/20/solid';

export default function Goals() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const { data } = await api.get<Goal[]>('/goals');
                setGoals(data);
            } catch (error) {
                console.error('Failed to fetch goals', error);
            } finally {
                setLoading(false);
            }
        };
        fetchGoals();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading goals...</div>;

    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Goals</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all your goals and their current status.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <Link
                        to="/goals/new"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                    >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Add Goal
                    </Link>
                </div>
            </div>

            {goals.length === 0 ? (
                <div className="mt-10 text-center">
                    <p className="text-gray-500">You haven't created any goals yet.</p>
                </div>
            ) : (
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {goals.map((goal) => (
                        <GoalCard key={goal._id} goal={goal} />
                    ))}
                </div>
            )}
        </div>
    );
}
