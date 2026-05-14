import Staff2Layout from '@/Layouts/Staff2Layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function ResidentDetails() {
    const { residents } = usePage().props;
    const { data, setData, post, patch, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        middle_name: '',
        birth_date: '',
        gender: '',
        civil_status: '',
        barangay: '',
        zone_sitio: '',
        contact_number: '',
        email: '',
        emergency_contact_name: '',
        emergency_contact_number: '',
        emergency_contact_relationship: '',
    });

    const [showForm, setShowForm] = useState(false);
    const [editingResident, setEditingResident] = useState(null);

    const barangayOptions = [
        'Awang',
        'Bagocboc',
        'Barra',
        'Bonbon',
        'Cauyonan',
        'Igpit',
        'Limonda',
        'Luyong Bonbon',
        'Malanang',
        'Nangcaon',
        'Patag',
        'Poblacion',
        'Taboc',
        'Tingalan',
    ];

    const zoneSitioOptions = {
        'Igpit': ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6'],
        'Barra': ['Gordo area'],
        'Bagocboc': ['Sitio Langgamon', 'Bayogbayogan'],
        'Limonda': ['Sitio Tulod'],
        'Nangcaon': ['Sitio Tagculot', 'Pigtao', 'Tao-tawili'],
        'Tingalan': ['Sitio Limbasan', 'Salawaga'],
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingResident) {
            patch(route('staff2.resident-details.update', editingResident.id), {
                onSuccess: () => {
                    reset();
                    setShowForm(false);
                    setEditingResident(null);
                }
            });
        } else {
            post(route('staff2.resident-details.store'), {
                onSuccess: () => {
                    reset();
                    setShowForm(false);
                }
            });
        }
    };

    const handleEdit = (resident) => {
        setEditingResident(resident);
        setData({
            first_name: resident.first_name,
            last_name: resident.last_name,
            middle_name: resident.middle_name,
            birth_date: resident.birth_date,
            gender: resident.gender,
            civil_status: resident.civil_status,
            barangay: resident.barangay,
            zone_sitio: resident.zone_sitio || '',
            contact_number: resident.contact_number,
            email: resident.email,
            emergency_contact_name: resident.emergency_contact_name,
            emergency_contact_number: resident.emergency_contact_number,
            emergency_contact_relationship: resident.emergency_contact_relationship,
        });
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this resident?')) {
            window.location.href = route('staff2.resident-details.destroy', id);
        }
    };

    const handleCancel = () => {
        reset();
        setShowForm(false);
        setEditingResident(null);
    };

    return (
        <Staff2Layout>
            <Head title="Resident Details" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-700 uppercase">Resident Details</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-4 py-2 bg-[#4ecdc4] text-white rounded-lg font-medium hover:bg-[#3dbdb5] transition-colors"
                    >
                        {showForm ? 'Cancel' : '+ Add Resident'}
                    </button>
                </div>

                {showForm && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-700 mb-4">
                            {editingResident ? 'Edit Resident' : 'Add New Resident'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                                    <input
                                        type="text"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecdc4] focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                                    <input
                                        type="text"
                                        value={data.middle_name}
                                        onChange={(e) => setData('middle_name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecdc4] focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                                    <input
                                        type="text"
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecdc4] focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date *</label>
                                    <input
                                        type="date"
                                        value={data.birth_date}
                                        onChange={(e) => setData('birth_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecdc4] focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                                    <select
                                        value={data.gender}
                                        onChange={(e) => setData('gender', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecdc4] focus:border-transparent"
                                        required
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Civil Status *</label>
                                    <select
                                        value={data.civil_status}
                                        onChange={(e) => setData('civil_status', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecdc4] focus:border-transparent"
                                        required
                                    >
                                        <option value="">Select Civil Status</option>
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Widowed">Widowed</option>
                                        <option value="Divorced">Divorced</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Barangay *</label>
                                    <select
                                        value={data.barangay}
                                        onChange={(e) => {
                                            setData('barangay', e.target.value);
                                            setData('zone_sitio', ''); // Reset zone/sitio when barangay changes
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecdc4] focus:border-transparent"
                                        required
                                    >
                                        <option value="">Select Barangay</option>
                                        {barangayOptions.map((barangay) => (
                                            <option key={barangay} value={barangay}>{barangay}</option>
                                        ))}
                                    </select>
                                </div>
                                {zoneSitioOptions[data.barangay] && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Zone/Sitio</label>
                                        <select
                                            value={data.zone_sitio}
                                            onChange={(e) => setData('zone_sitio', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecdc4] focus:border-transparent"
                                        >
                                            <option value="">Select Zone/Sitio</option>
                                            {zoneSitioOptions[data.barangay].map((zone) => (
                                                <option key={zone} value={zone}>{zone}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
                                    <input
                                        type="tel"
                                        value={data.contact_number}
                                        onChange={(e) => setData('contact_number', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecdc4] focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecdc4] focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4 mt-4">
                                <h3 className="text-md font-semibold text-gray-700 mb-3">Emergency Contact</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                                        <input
                                            type="text"
                                            value={data.emergency_contact_name}
                                            onChange={(e) => setData('emergency_contact_name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecdc4] focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                        <input
                                            type="tel"
                                            value={data.emergency_contact_number}
                                            onChange={(e) => setData('emergency_contact_number', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecdc4] focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                                        <input
                                            type="text"
                                            value={data.emergency_contact_relationship}
                                            onChange={(e) => setData('emergency_contact_relationship', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecdc4] focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-[#4ecdc4] text-white rounded-lg font-medium hover:bg-[#3dbdb5] transition-colors disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : (editingResident ? 'Update Resident' : 'Add Resident')}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-base font-bold text-gray-700">Resident List ({residents.length})</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-400 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-3 text-left">Name</th>
                                    <th className="px-6 py-3 text-left">Gender</th>
                                    <th className="px-6 py-3 text-left">Civil Status</th>
                                    <th className="px-6 py-3 text-left">Address</th>
                                    <th className="px-6 py-3 text-left">Contact</th>
                                    <th className="px-6 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {residents.map((resident) => (
                                    <tr key={resident.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-3">
                                            <div className="font-medium text-gray-800">
                                                {resident.last_name}, {resident.first_name} {resident.middle_name}
                                            </div>
                                            <div className="text-xs text-gray-400">{resident.email}</div>
                                        </td>
                                        <td className="px-6 py-3 text-gray-500">{resident.gender}</td>
                                        <td className="px-6 py-3 text-gray-500">{resident.civil_status}</td>
                                        <td className="px-6 py-3 text-gray-500">
                                            <div className="text-xs text-gray-400">{resident.barangay}{resident.zone_sitio && ` - ${resident.zone_sitio}`}</div>
                                        </td>
                                        <td className="px-6 py-3 text-gray-500">{resident.contact_number}</td>
                                        <td className="px-6 py-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(resident)}
                                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(resident.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {residents.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                            No residents found. Click "Add Resident" to add one.
                        </div>
                    )}
                </div>
            </div>
        </Staff2Layout>
    );
}
