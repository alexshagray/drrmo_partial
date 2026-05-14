import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';

export default function Reports({ inventorySummary, incidentStats }) {
    return (
        <AuthenticatedLayout>
            <Head title="Reports & Analytics" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Reports & Analytics</h2>
                        <p className="text-gray-600 mt-1">View inventory and incident summaries</p>
                    </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                                <h3 className="text-sm font-medium text-slate-500">Inventory Items</h3>
                                <p className="mt-2 text-3xl font-bold text-slate-800">{inventorySummary.total_items}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                                <h3 className="text-sm font-medium text-slate-500">Total Stock</h3>
                                <p className="mt-2 text-3xl font-bold text-slate-800">{inventorySummary.total_quantity}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                                <h3 className="text-sm font-medium text-slate-500">Low Stock Items</h3>
                                <p className="mt-2 text-3xl font-bold text-red-600">{inventorySummary.low_stock_count}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Inventory by Category</h3>
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Category</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Count</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {inventorySummary.by_category.map((cat) => (
                                            <tr key={cat.category}>
                                                <td className="px-4 py-2 text-sm text-slate-800">{cat.category}</td>
                                                <td className="px-4 py-2 text-sm text-slate-500">{cat.count}</td>
                                                <td className="px-4 py-2 text-sm text-slate-500">{cat.total}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Incident Statistics</h3>
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-slate-800">{incidentStats.total}</div>
                                        <div className="text-xs text-slate-500">Total</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-yellow-600">{incidentStats.active}</div>
                                        <div className="text-xs text-slate-500">Active</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-emerald-600">{incidentStats.resolved}</div>
                                        <div className="text-xs text-slate-500">Resolved</div>
                                    </div>
                                </div>
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Severity</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Count</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {incidentStats.by_severity.map((sev) => (
                                            <tr key={sev.severity}>
                                                <td className="px-4 py-2 text-sm text-slate-800 capitalize">{sev.severity}</td>
                                                <td className="px-4 py-2 text-sm text-slate-500">{sev.count}</td>
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
