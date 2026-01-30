import { Component, type ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
}

class AuthLayout extends Component<AuthLayoutProps> {
    render() {
        const { children, title, subtitle } = this.props;
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-all">

                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {title}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {subtitle}
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow-xl border border-gray-100 sm:rounded-2xl sm:px-10">
                        {children}
                    </div>

                    <p className="mt-8 text-center text-xs text-gray-400">
                        &copy; 2026 E-POS System. All rights reserved.
                    </p>
                </div>
            </div>
        );
    }
}

export default AuthLayout;