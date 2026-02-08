import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="flex min-h-full flex-col bg-white pt-16 pb-12">
            <main className="flex w-full flex-grow flex-col justify-center px-4 sm:px-6 lg:px-8">
                <div className="flex flex-shrink-0 justify-center">
                    <Link to="/" className="inline-flex">
                        <span className="sr-only">GoalTrackr</span>
                        <span className="text-4xl font-bold text-indigo-600">404</span>
                    </Link>
                </div>
                <div className="py-16">
                    <div className="text-center">
                        <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found.</h1>
                        <p className="mt-2 text-base text-gray-500">Sorry, we couldn’t find the page you’re looking for.</p>
                        <div className="mt-6">
                            <Link to="/" className="text-base font-medium text-indigo-600 hover:text-indigo-500">
                                Go back home
                                <span aria-hidden="true"> &rarr;</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
