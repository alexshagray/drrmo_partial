import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';

export default function AdminDashboard() {
    const { auth } = usePage().props;
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        email: auth?.user?.email || '',
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
        otp: '',
    });

    const handlePasswordChange = (e) => {
        e.preventDefault();
        post('/password/change/request', {
            onSuccess: () => {
                setShowPasswordModal(false);
                setShowOtpModal(true);
            },
        });
    };

    const handleOtpVerification = (e) => {
        e.preventDefault();
        post('/password/change/verify', {
            onSuccess: () => {
                setShowOtpModal(false);
                data.current_password = '';
                data.new_password = '';
                data.new_password_confirmation = '';
                data.otp = '';
                alert('Password changed successfully!');
            },
        });
    };

    const navigationItems = [
        { title: 'Dashboard', route: 'admin.dashboard', icon: '📊' },
        { title: 'Reports & Analytics', route: 'admin.reports', icon: '📈' },
        { title: 'User Management', route: 'admin.users', icon: '👥' },
        { title: 'System Oversight', route: 'admin.oversight', icon: '🔍' },
    ];

    const quickActions = [
        { title: 'Reports & Analytics', desc: 'View inventory and incident summaries', route: 'admin.reports', icon: '📈', color: 'bg-blue-500' },
        { title: 'User Management', desc: 'Manage users and role assignments', route: 'admin.users', icon: '👥', color: 'bg-green-500' },
        { title: 'System Oversight', desc: 'System logs and activity monitoring', route: 'admin.oversight', icon: '🔍', color: 'bg-purple-500' },
        { title: 'Change Password', desc: 'Update your account password', route: 'change-password', icon: '🔐', color: 'bg-orange-500', action: () => setShowPasswordModal(true) },
    ];

    const stats = [
        { title: 'Total Users', value: '24', change: '+12%', icon: '👥', color: 'text-blue-600', bgColor: 'bg-blue-100' },
        { title: 'Active Sessions', value: '8', change: '+5%', icon: '🟢', color: 'text-green-600', bgColor: 'bg-green-100' },
        { title: 'Pending Approvals', value: '3', change: '-2', icon: '⏳', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
        { title: 'System Health', value: '98%', change: '+0.5%', icon: '💚', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
                        <p className="text-gray-600 mt-1">Welcome back, {auth?.user?.name || 'Administrator'}</p>
                    </div>

                        {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                                        <p className="text-3xl font-bold text-slate-800 mt-2">{stat.value}</p>
                                        <p className={`text-sm mt-2 ${stat.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {stat.change} from last month
                                        </p>
                                    </div>
                                    <div className={`${stat.bgColor} p-4 rounded-full shadow-sm`}>
                                        <span className="text-2xl">{stat.icon}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {quickActions.map((action, index) => (
                                action.action ? (
                                    <button
                                        key={index}
                                        onClick={action.action}
                                        className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-200 text-left group"
                                    >
                                        <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm`}>
                                            <span className="text-2xl text-white">{action.icon}</span>
                                        </div>
                                        <h4 className="font-semibold text-slate-800">{action.title}</h4>
                                        <p className="text-sm text-slate-500 mt-1">{action.desc}</p>
                                    </button>
                                ) : (
                                    <Link
                                        key={index}
                                        href={route(action.route)}
                                        className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-200 text-left group"
                                    >
                                        <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm`}>
                                            <span className="text-2xl text-white">{action.icon}</span>
                                        </div>
                                        <h4 className="font-semibold text-slate-800">{action.title}</h4>
                                        <p className="text-sm text-slate-500 mt-1">{action.desc}</p>
                                    </Link>
                                )
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Recent Activity</h3>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-lg">👤</span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-slate-800">New user registered</p>
                                    <p className="text-sm text-slate-500">2 minutes ago</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <span className="text-lg">✅</span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-slate-800">User approved</p>
                                    <p className="text-sm text-slate-500">15 minutes ago</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                    <span className="text-lg">📊</span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-slate-800">Report generated</p>
                                    <p className="text-sm text-slate-500">1 hour ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

                {/* Password Change Modal */}
                {showPasswordModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                                <form onSubmit={handlePasswordChange}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Current Password</label>
                                            <input
                                                type="password"
                                                value={data.current_password}
                                                onChange={(e) => setData('current_password', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            />
                                            {errors.current_password && <p className="mt-1 text-sm text-red-600">{errors.current_password}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                                            <input
                                                type="password"
                                                value={data.new_password}
                                                onChange={(e) => setData('new_password', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                                minLength={8}
                                            />
                                            {errors.new_password && <p className="mt-1 text-sm text-red-600">{errors.new_password}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                            <input
                                                type="password"
                                                value={data.new_password_confirmation}
                                                onChange={(e) => setData('new_password_confirmation', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            />
                                            {errors.new_password_confirmation && <p className="mt-1 text-sm text-red-600">{errors.new_password_confirmation}</p>}
                                        </div>
                                    </div>
                                    <div className="mt-6 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswordModal(false)}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                                        >
                                            {processing ? 'Sending...' : 'Send OTP'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* OTP Verification Modal */}
                    {showOtpModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Verify OTP</h3>
                                <p className="text-sm text-gray-500 mb-4">Enter the 6-digit code sent to your email: {auth?.user?.email}</p>
                                <form onSubmit={handleOtpVerification}>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">OTP Code</label>
                                        <input
                                            type="text"
                                            value={data.otp}
                                            onChange={(e) => setData('otp', e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                            maxLength={6}
                                            placeholder="000000"
                                        />
                                        {errors.otp && <p className="mt-1 text-sm text-red-600">{errors.otp}</p>}
                                    </div>
                                    <div className="mt-6 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowOtpModal(false)}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                                        >
                                            {processing ? 'Verifying...' : 'Verify'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
        </AuthenticatedLayout>
    );
}
