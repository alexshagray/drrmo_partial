import Staff2Layout from '@/Layouts/Staff2Layout';
import { Head } from '@inertiajs/react';

export default function PostEventReports({ reports }) {
    const printEmergencySummary = (report) => {
        const incident = report.incident || {};
        const printWindow = window.open('', '_blank');
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Emergency Summary Report - ${report.title}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 20px;
                        line-height: 1.6;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 2px solid #333;
                        padding-bottom: 20px;
                        margin-bottom: 20px;
                    }
                    .header h1 {
                        margin: 0;
                        color: #1e3a8a;
                    }
                    .header h2 {
                        margin: 10px 0 0 0;
                        color: #6b7280;
                        font-size: 14px;
                    }
                    .report-info {
                        background: #f3f4f6;
                        padding: 15px;
                        border-radius: 8px;
                        margin-bottom: 20px;
                    }
                    .report-info div {
                        margin: 5px 0;
                    }
                    .report-info strong {
                        color: #1f2937;
                    }
                    .section {
                        margin-bottom: 20px;
                    }
                    .section h3 {
                        color: #1e3a8a;
                        border-bottom: 1px solid #e5e7eb;
                        padding-bottom: 8px;
                        margin-bottom: 10px;
                    }
                    .status-final { background: #d1fae5; color: #065f46; padding: 5px 10px; border-radius: 4px; display: inline-block; font-weight: bold; }
                    .status-draft { background: #fef3c7; color: #92400e; padding: 5px 10px; border-radius: 4px; display: inline-block; font-weight: bold; }
                    .status-archived { background: #e5e7eb; color: #374151; padding: 5px 10px; border-radius: 4px; display: inline-block; font-weight: bold; }
                    .footer {
                        margin-top: 40px;
                        text-align: center;
                        font-size: 12px;
                        color: #6b7280;
                        border-top: 1px solid #e5e7eb;
                        padding-top: 20px;
                    }
                    @media print {
                        body { padding: 0; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>POST-EVENT SUMMARY REPORT</h1>
                    <h2>MDRRMO Emergency Response System</h2>
                </div>
                
                <div class="report-info">
                    <div><strong>Report ID:</strong> #${report.id}</div>
                    <div><strong>Report Title:</strong> ${report.title}</div>
                    <div><strong>Status:</strong> <span class="status-${report.status}">${report.status ? report.status.toUpperCase() : 'N/A'}</span></div>
                    <div><strong>Report Date:</strong> ${report.created_at ? new Date(report.created_at).toLocaleString() : new Date().toLocaleString()}</div>
                    ${incident.id ? `<div><strong>Related Incident:</strong> ${incident.title || 'N/A'}</div>` : ''}
                    ${incident.severity ? `<div><strong>Incident Severity:</strong> ${incident.severity.toUpperCase()}</div>` : ''}
                    ${incident.location_name ? `<div><strong>Location:</strong> ${incident.location_name}</div>` : ''}
                </div>

                <div class="section">
                    <h3>EXECUTIVE SUMMARY</h3>
                    <p>${report.summary || 'No summary provided'}</p>
                </div>

                ${report.actions_taken ? `
                <div class="section">
                    <h3>ACTIONS TAKEN</h3>
                    <p>${report.actions_taken}</p>
                </div>
                ` : ''}

                ${report.lessons_learned ? `
                <div class="section">
                    <h3>LESSONS LEARNED</h3>
                    <p>${report.lessons_learned}</p>
                </div>
                ` : ''}

                ${report.recommendations ? `
                <div class="section">
                    <h3>RECOMMENDATIONS</h3>
                    <p>${report.recommendations}</p>
                </div>
                ` : ''}

                ${incident.description ? `
                <div class="section">
                    <h3>ORIGINAL INCIDENT DESCRIPTION</h3>
                    <p>${incident.description}</p>
                </div>
                ` : ''}

                <div class="footer">
                    <p>Generated on: ${new Date().toLocaleString()}</p>
                    <p>MDRMO Emergency Response System - Official Report</p>
                </div>
            </body>
            </html>
        `;
        
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 250);
    };

    return (
        <Staff2Layout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Post-Event Reporting</h2>}
        >
            <Head title="Post-Event Reports" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Post-Event Reports</h3>
                        <div className="space-y-4">
                            {reports.map((r) => (
                                <div key={r.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-lg font-medium text-gray-900">{r.title}</h4>
                                            <p className="text-sm text-gray-500">Incident: {r.incident?.title || 'N/A'}</p>
                                            <p className="text-sm text-gray-500">Date: {r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A'}</p>
                                        </div>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            r.status === 'final' ? 'bg-green-100 text-green-800' :
                                            r.status === 'archived' ? 'bg-gray-100 text-gray-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {r.status}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-700">{r.summary}</p>
                                    {r.actions_taken && (
                                        <p className="mt-2 text-sm text-gray-600"><strong>Actions Taken:</strong> {r.actions_taken}</p>
                                    )}
                                    {r.lessons_learned && (
                                        <p className="mt-2 text-sm text-gray-600"><strong>Lessons Learned:</strong> {r.lessons_learned}</p>
                                    )}
                                    {r.recommendations && (
                                        <p className="mt-2 text-sm text-gray-600"><strong>Recommendations:</strong> {r.recommendations}</p>
                                    )}
                                    <div className="mt-3">
                                        <button
                                            onClick={() => printEmergencySummary(r)}
                                            className="inline-flex items-center px-3 py-1.5 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700"
                                        >
                                            🖨️ Print Summary
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {reports.length === 0 && (
                                <p className="text-gray-500 text-center py-8">No post-event reports available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Staff2Layout>
    );
}
