import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { Goal, ProgressNote } from '../types';
import GoalCard from '../components/GoalCard';
import { PlusIcon } from '@heroicons/react/20/solid';
import { format } from 'date-fns';

export default function Dashboard() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [recentNotes, setRecentNotes] = useState<ProgressNote[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [goalsRes, notesRes] = await Promise.all([
                    api.get<Goal[]>('/goals'),
                    api.get<ProgressNote[]>('/progress?limit=5')
                ]);
                setGoals(goalsRes.data);
                setRecentNotes(notesRes.data);
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const stats = [
        { name: 'Total Goals', stat: goals.length },
        { name: 'Completed', stat: goals.filter(g => g.status === 'Completed').length },
        { name: 'In Progress', stat: goals.filter(g => g.status === 'In progress').length },
    ];

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Stats */}
            <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Overview</h3>
                <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                    {stats.map((item) => (
                        <div key={item.name} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                            <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
                            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item.stat}</dd>
                        </div>
                    ))}
                </dl>
            </div>

            {/* Recent Goals (Limit to 3) */}
            <div>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Goals</h3>
                    <div className="flex space-x-4">
                        <Link to="/goals/new" className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white hover:bg-indigo-700">
                            <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                            Add Goal
                        </Link>
                        <Link to="/goals" className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 hover:bg-gray-50">
                            View All
                        </Link>
                    </div>
                </div>

                {goals.length === 0 ? (
                    <div className="mt-5 rounded-lg bg-white p-6 text-center shadow">
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No goals yet</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new goal.</p>
                        <div className="mt-6">
                            <Link
                                to="/goals/new"
                                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                            >
                                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                New Goal
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {goals.slice(0, 3).map((goal) => (
                            <GoalCard key={goal._id} goal={goal} />
                        ))}
                    </div>
                )}
            </div>

            {/* Recent Activity / Notes */}
            <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Activity</h3>
                <div className="mt-5 overflow-hidden bg-white shadow sm:rounded-md">
                    {recentNotes.length === 0 ? (
                        <p className="p-6 text-center text-gray-500">No activity yet.</p>
                    ) : (
                        <ul role="list" className="divide-y divide-gray-200">
                            {recentNotes.map((note) => (
                                <li key={note._id}>
                                    <div className="block hover:bg-gray-50 px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <p className="truncate text-sm font-medium text-indigo-600">
                                                Goal: {(note as any).goalId?.title || 'Unknown Goal'}
                                            </p>
                                            <div className="ml-2 flex flex-shrink-0">
                                                <p className="text-xs text-gray-500">
                                                    {format(new Date(note.date), 'MMM d, h:mm a')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-700">
                                            <p className="line-clamp-2">{note.content}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
