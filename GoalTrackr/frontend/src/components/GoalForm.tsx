import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Goal, GoalCategory, GoalStatus } from '../types';
import api from '../services/api';
import toast from 'react-hot-toast';

interface GoalFormProps {
    initialData?: Goal;
    isEdit?: boolean;
}

const CATEGORIES: GoalCategory[] = ['Personal', 'Health', 'Career', 'Learning', 'Finance', 'Other'];
const STATUSES: GoalStatus[] = ['Not started', 'In progress', 'Completed', 'Archived'];

export default function GoalForm({ initialData, isEdit = false }: GoalFormProps) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        category: initialData?.category || 'Personal',
        startDate: initialData?.startDate ? initialData.startDate.split('T')[0] : new Date().toISOString().split('T')[0],
        targetDate: initialData?.targetDate ? initialData.targetDate.split('T')[0] : '',
        status: initialData?.status || 'Not started',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEdit && initialData) {
                await api.put(`/goals/${initialData._id}`, formData);
                toast.success('Goal updated successfully');
                navigate(`/goals/${initialData._id}`);
            } else {
                await api.post('/goals', formData);
                toast.success('Goal created successfully');
                navigate('/goals');
            }
        } catch (error) {
            toast.error('Failed to save goal');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow rounded-lg max-w-2xl mx-auto">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Goal Title</label>
                <div className="mt-1">
                    <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <div className="mt-1">
                    <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                    <div className="mt-1">
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value as GoalCategory })}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                    <div className="mt-1">
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as GoalStatus })}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            {STATUSES.map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                    <div className="mt-1">
                        <input
                            type="date"
                            name="startDate"
                            id="startDate"
                            required
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700">Target Date</label>
                    <div className="mt-1">
                        <input
                            type="date"
                            name="targetDate"
                            id="targetDate"
                            required
                            value={formData.targetDate}
                            onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mr-3 rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    {loading ? 'Saving...' : isEdit ? 'Update Goal' : 'Create Goal'}
                </button>
            </div>
        </form>
    );
}
