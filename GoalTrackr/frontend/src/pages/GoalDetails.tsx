import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { Goal, ProgressNote } from '../types';
import NoteForm from '../components/NoteForm';
import { TrashIcon, PencilSquareIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import clsx from 'clsx';

export default function GoalDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [goal, setGoal] = useState<Goal | null>(null);
    const [notes, setNotes] = useState<ProgressNote[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [goalRes, notesRes] = await Promise.all([
                    api.get<Goal>(`/goals/${id}`),
                    api.get<ProgressNote[]>(`/progress?goalId=${id}`)
                ]);
                setGoal(goalRes.data);
                setNotes(notesRes.data);
            } catch (error) {
                console.error('Failed to fetch goal details', error);
                toast.error('Could not load goal');
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchData();
    }, [id]);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this goal? This action cannot be undone.')) return;
        try {
            await api.delete(`/goals/${id}`);
            toast.success('Goal deleted');
            navigate('/goals');
        } catch (error) {
            toast.error('Failed to delete goal');
        }
    };

    const handleComplete = async () => {
        if (!goal) return;
        try {
            const updatedGoal = { ...goal, status: 'Completed' };
            await api.put(`/goals/${id}`, updatedGoal);
            setGoal(updatedGoal as Goal);
            toast.success('Goal marked as completed!');
        } catch (error) {
            toast.error('Failed to update goal');
        }
    };

    const handleDeleteNote = async (noteId: string) => {
        if (!confirm('Delete this note?')) return;
        try {
            await api.delete(`/progress/${id}`, { params: { noteId } }); // Pass noteId as param, strictly speaking usage of progress API
            // Wait, api/progress.ts handles DELETE?
            // Yes, if event.httpMethod === 'DELETE' and noteId is present.
            // But I mapped /api/progress/:goalId -> progress?goalId=...
            // So calling DELETE /api/progress/123?noteId=456 works.

            setNotes(notes.filter(n => n._id !== noteId));
            toast.success('Note deleted');
        } catch (error) {
            // Retry with just /progress endpoint if rewrite issue? 
            // Logic in API requires noteId query param.
            toast.error('Failed to delete note');
        }
    };

    const onNoteAdded = (newNote: ProgressNote) => {
        setNotes([newNote, ...notes]);
    };

    if (loading) return <div className="p-8 text-center">Loading goal...</div>;
    if (!goal) return <div className="p-8 text-center">Goal not found</div>;

    return (
        <div>
            {/* Header */}
            <div className="md:flex md:items-center md:justify-between mb-6">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        {goal.title}
                    </h2>
                    <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                            <span className={clsx(
                                goal.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800',
                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                            )}>
                                {goal.status}
                            </span>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                            Target: {format(new Date(goal.targetDate), 'MMM d, yyyy')}
                        </div>
                    </div>
                </div>
                <div className="mt-4 flex md:ml-4 md:mt-0">
                    {goal.status !== 'Completed' && (
                        <button
                            type="button"
                            onClick={handleComplete}
                            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mr-3"
                        >
                            <CheckCircleIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                            Mark Complete
                        </button>
                    )}
                    <Link
                        to={`/goals/${id}/edit`}
                        className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mr-3"
                    >
                        <PencilSquareIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                        Edit
                    </Link>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                    >
                        <TrashIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                        Delete
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white shadow sm:rounded-lg p-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Description</h3>
                        <p className="text-gray-700 whitespace-pre-wrap">{goal.description || 'No description provided.'}</p>
                    </div>

                    <div className="bg-white shadow sm:rounded-lg p-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Progress Notes</h3>
                        <div className="flow-root">
                            <ul role="list" className="-mb-8">
                                {notes.map((note, noteIdx) => (
                                    <li key={note._id}>
                                        <div className="relative pb-8">
                                            {noteIdx !== notes.length - 1 ? (
                                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                            ) : null}
                                            <div className="relative flex space-x-3">
                                                <div>
                                                    <span className={clsx(
                                                        'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white',
                                                        'bg-indigo-100'
                                                    )}>
                                                        <div className='h-2.5 w-2.5 rounded-full bg-indigo-600'></div>
                                                    </span>
                                                </div>
                                                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                                    <div>
                                                        <p className="text-sm text-gray-500">
                                                            {note.content}
                                                        </p>
                                                    </div>
                                                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                                        <time dateTime={note.date}>{format(new Date(note.date), 'MMM d')}</time>
                                                        <button
                                                            onClick={() => handleDeleteNote(note._id)}
                                                            className="ml-4 text-red-400 hover:text-red-600"
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            {notes.length === 0 && <p className="text-gray-500 italic">No notes yet.</p>}
                        </div>
                        <NoteForm goalId={id || ''} onNoteAdded={onNoteAdded} />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white shadow sm:rounded-lg p-6">
                        <h3 className="text-sm font-medium text-gray-500">Goal Info</h3>
                        <dl className="mt-2 divide-y divide-gray-200 border-t border-b border-gray-200">
                            <div className="flex justify-between py-3 text-sm font-medium">
                                <dt className="text-gray-500">Category</dt>
                                <dd className="text-gray-900">{goal.category}</dd>
                            </div>
                            <div className="flex justify-between py-3 text-sm font-medium">
                                <dt className="text-gray-500">Start Date</dt>
                                <dd className="text-gray-900">{format(new Date(goal.startDate), 'MMM d, yyyy')}</dd>
                            </div>
                            <div className="flex justify-between py-3 text-sm font-medium">
                                <dt className="text-gray-500">Created</dt>
                                <dd className="text-gray-900">{format(new Date(goal.createdAt), 'MMM d, yyyy')}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}
