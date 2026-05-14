import{n as e,t}from"./app-CU7cbXGa.js";import{t as n}from"./Staff2Layout-DYbHm5M4.js";var r=t();function i({reports:t}){let i=e=>{let t=e.incident||{},n=window.open(``,`_blank`),r=`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Emergency Summary Report - ${e.title}</title>
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
                    <h2>Balansag Emergency Response System</h2>
                </div>
                
                <div class="report-info">
                    <div><strong>Report ID:</strong> #${e.id}</div>
                    <div><strong>Report Title:</strong> ${e.title}</div>
                    <div><strong>Status:</strong> <span class="status-${e.status}">${e.status?e.status.toUpperCase():`N/A`}</span></div>
                    <div><strong>Report Date:</strong> ${e.created_at?new Date(e.created_at).toLocaleString():new Date().toLocaleString()}</div>
                    ${t.id?`<div><strong>Related Incident:</strong> ${t.title||`N/A`}</div>`:``}
                    ${t.severity?`<div><strong>Incident Severity:</strong> ${t.severity.toUpperCase()}</div>`:``}
                    ${t.location_name?`<div><strong>Location:</strong> ${t.location_name}</div>`:``}
                </div>

                <div class="section">
                    <h3>EXECUTIVE SUMMARY</h3>
                    <p>${e.summary||`No summary provided`}</p>
                </div>

                ${e.actions_taken?`
                <div class="section">
                    <h3>ACTIONS TAKEN</h3>
                    <p>${e.actions_taken}</p>
                </div>
                `:``}

                ${e.lessons_learned?`
                <div class="section">
                    <h3>LESSONS LEARNED</h3>
                    <p>${e.lessons_learned}</p>
                </div>
                `:``}

                ${e.recommendations?`
                <div class="section">
                    <h3>RECOMMENDATIONS</h3>
                    <p>${e.recommendations}</p>
                </div>
                `:``}

                ${t.description?`
                <div class="section">
                    <h3>ORIGINAL INCIDENT DESCRIPTION</h3>
                    <p>${t.description}</p>
                </div>
                `:``}

                <div class="footer">
                    <p>Generated on: ${new Date().toLocaleString()}</p>
                    <p>Balansag Emergency Response System - Official Report</p>
                </div>
            </body>
            </html>
        `;n.document.write(r),n.document.close(),n.focus(),setTimeout(()=>{n.print()},250)};return(0,r.jsxs)(n,{header:(0,r.jsx)(`h2`,{className:`text-xl font-semibold leading-tight text-gray-800`,children:`Post-Event Reporting`}),children:[(0,r.jsx)(e,{title:`Post-Event Reports`}),(0,r.jsx)(`div`,{className:`py-12`,children:(0,r.jsx)(`div`,{className:`mx-auto max-w-7xl sm:px-6 lg:px-8`,children:(0,r.jsxs)(`div`,{className:`bg-white overflow-hidden shadow-sm sm:rounded-lg p-6`,children:[(0,r.jsx)(`h3`,{className:`text-lg font-medium text-gray-900 mb-4`,children:`Post-Event Reports`}),(0,r.jsxs)(`div`,{className:`space-y-4`,children:[t.map(e=>(0,r.jsxs)(`div`,{className:`border border-gray-200 rounded-lg p-4`,children:[(0,r.jsxs)(`div`,{className:`flex justify-between items-start`,children:[(0,r.jsxs)(`div`,{children:[(0,r.jsx)(`h4`,{className:`text-lg font-medium text-gray-900`,children:e.title}),(0,r.jsxs)(`p`,{className:`text-sm text-gray-500`,children:[`Incident: `,e.incident?.title||`N/A`]}),(0,r.jsxs)(`p`,{className:`text-sm text-gray-500`,children:[`Date: `,e.created_at?new Date(e.created_at).toLocaleDateString():`N/A`]})]}),(0,r.jsx)(`span`,{className:`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${e.status===`final`?`bg-green-100 text-green-800`:e.status===`archived`?`bg-gray-100 text-gray-800`:`bg-yellow-100 text-yellow-800`}`,children:e.status})]}),(0,r.jsx)(`p`,{className:`mt-2 text-sm text-gray-700`,children:e.summary}),e.actions_taken&&(0,r.jsxs)(`p`,{className:`mt-2 text-sm text-gray-600`,children:[(0,r.jsx)(`strong`,{children:`Actions Taken:`}),` `,e.actions_taken]}),e.lessons_learned&&(0,r.jsxs)(`p`,{className:`mt-2 text-sm text-gray-600`,children:[(0,r.jsx)(`strong`,{children:`Lessons Learned:`}),` `,e.lessons_learned]}),e.recommendations&&(0,r.jsxs)(`p`,{className:`mt-2 text-sm text-gray-600`,children:[(0,r.jsx)(`strong`,{children:`Recommendations:`}),` `,e.recommendations]}),(0,r.jsx)(`div`,{className:`mt-3`,children:(0,r.jsx)(`button`,{onClick:()=>i(e),className:`inline-flex items-center px-3 py-1.5 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700`,children:`🖨️ Print Summary`})})]},e.id)),t.length===0&&(0,r.jsx)(`p`,{className:`text-gray-500 text-center py-8`,children:`No post-event reports available.`})]})]})})})]})}export{i as default};