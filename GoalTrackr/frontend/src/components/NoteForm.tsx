import { useState, type FormEvent } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import type { ProgressNote } from '../types';

interface NoteFormProps {
    goalId: string;
    onNoteAdded: (note: ProgressNote) => void;
}

export default function NoteForm({ goalId, onNoteAdded }: NoteFormProps) {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsSubmitting(true);
        try {
            const { data } = await api.post<ProgressNote>('/progress', { content }, {
                params: { goalId }
            });
            onNoteAdded(data);
            setContent('');
            toast.success('Note added');
        } catch (error) {
            toast.error('Failed to add note');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6">
            <div>
                <label htmlFor="comment" className="sr-only">
                    Add your progress note
                </label>
                <textarea
                    rows={3}
                    name="comment"
                    id="comment"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Add a progress note..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>
            <div className="mt-3 flex items-center justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting || !content.trim()}
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {isSubmitting ? 'Adding...' : 'Add Note'}
                </button>
            </div>
        </form>
    );
}
