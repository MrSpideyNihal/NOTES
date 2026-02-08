import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import type { Goal } from '../types';
import GoalForm from '../components/GoalForm';

export default function EditGoal() {
    const { id } = useParams<{ id: string }>();
    const [goal, setGoal] = useState<Goal | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGoal = async () => {
            try {
                const { data } = await api.get<Goal>(`/goals/${id}`);
                setGoal(data);
            } catch (error) {
                console.error('Failed to fetch goal', error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchGoal();
    }, [id]);

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!goal) return <div className="p-8 text-center">Goal not found</div>;

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Edit Goal</h1>
            <GoalForm initialData={goal} isEdit />
        </div>
    );
}
