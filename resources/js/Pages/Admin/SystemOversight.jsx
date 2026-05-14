import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';

export default function SystemOversight({ stats, logs }) {
    return (
        <AuthenticatedLayout>
            <Head title="System Oversight" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">System Oversight</h2>
                        <p className="text-gray-600 mt-1">System logs and activity monitoring</p>
                    </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                                <h3 className="text-sm font-medium text-slate-500">Users</h3>
                                <p className="mt-2 text-3xl font-bold text-slate-800">{stats.users}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                                <h3 className="text-sm font-medium text-slate-500">Inventory Items</h3>
                                <p className="mt-2 text-3xl font-bold text-slate-800">{stats.inventory_items}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                                <h3 className="text-sm font-medium text-slate-500">Active Incidents</h3>
                                <p className="mt-2 text-3xl font-bold text-yellow-600">{stats.active_incidents}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                                <h3 className="text-sm font-medium text-slate-500">Resolved Incidents</h3>
                                <p className="mt-2 text-3xl font-bold text-emerald-600">{stats.resolved_incidents}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">System Logs</h3>
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Level</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Category</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Message</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">User</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {logs.map((log) => (
                                            <tr key={log.id}>
                                                <td className="px-4 py-2">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                        log.level === 'error' ? 'bg-red-100 text-red-800' :
                                                        log.level === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-emerald-100 text-emerald-800'
                                                    }`}>
                                                        {log.level}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-sm text-slate-500">{log.category}</td>
                                                <td className="px-4 py-2 text-sm text-slate-800">{log.message}</td>
                                                <td className="px-4 py-2 text-sm text-slate-500">{log.user?.name || 'System'}</td>
                                                <td className="px-4 py-2 text-sm text-slate-500">
                                                    {new Date(log.created_at).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
