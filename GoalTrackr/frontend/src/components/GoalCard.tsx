import { Link } from 'react-router-dom';
import type { Goal, GoalStatus } from '../types';
import clsx from 'clsx';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

interface GoalCardProps {
    goal: Goal;
}

const statusColors: Record<GoalStatus, string> = {
    'Not started': 'bg-gray-100 text-gray-800',
    'In progress': 'bg-blue-100 text-blue-800',
    'Completed': 'bg-green-100 text-green-800',
    'Archived': 'bg-yellow-100 text-yellow-800',
};

export default function GoalCard({ goal }: GoalCardProps) {
    return (
        <Link to={`/goals/${goal._id}`} className="block hover:shadow-md transition-shadow duration-200">
            <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-5">
                    <div className="flex items-center justify-between">
                        <div className="flex w-0 flex-1 justify-between">
                            <div className="truncate">
                                <div className="flex text-sm">
                                    <span className={clsx(
                                        statusColors[goal.status] || 'bg-gray-100 text-gray-800',
                                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium'
                                    )}>
                                        {goal.status}
                                    </span>
                                    <span className="ml-2 inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
                                        {goal.category}
                                    </span>
                                </div>
                                <h3 className="mt-2 text-lg font-medium leading-6 text-gray-900 truncate">
                                    {goal.title}
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm text-gray-500 line-clamp-2">
                            {goal.description}
                        </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                            <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                            <p>Target: <time dateTime={goal.targetDate}>{format(new Date(goal.targetDate), 'MMM d, yyyy')}</time></p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
