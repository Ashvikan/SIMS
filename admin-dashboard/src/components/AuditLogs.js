import React, { useEffect, useState } from "react";
import axios from "axios";

function AuditLogs() {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/audit-trails");
                setLogs(response.data);
            } catch (error) {
                console.error("Error fetching audit logs:", error);
            }
        };

        fetchLogs();
    }, []);

    return (
        <div>
            <h2>Audit Logs</h2>
            <div className="audit-logs">
                <table>
                    <thead>
                    <tr>
                        <th>Action</th>
                        <th>Details</th>
                        <th>Performed By</th>
                        <th>Timestamp</th>
                    </tr>
                    </thead>
                    <tbody>
                    {logs.map((log, index) => (
                        <tr key={index}>
                            <td>{log.action}</td>
                            <td>{JSON.stringify(log.details)}</td>
                            <td>{log.performedBy}</td>
                            <td>{new Date(log.timestamp).toLocaleString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AuditLogs;
