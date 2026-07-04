import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import "./ExecutionHistoryPage.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function ExecutionHistoryPage() {
    const exportPDF = () => {

        const doc = new jsPDF();

        const generatedDate =
            new Date().toLocaleString();

        doc.setFontSize(22);

        doc.text(
            "AI Testing System",
            14,
            20
        );

        doc.setFontSize(16);

        doc.text(
            "Execution History Report",
            14,
            32
        );

        doc.setFontSize(11);

        doc.text(
            `Generated On : ${generatedDate}`,
            14,
            46
        );

        doc.text(
            `Total Executions : ${history.length}`,
            14,
            53
        );

        autoTable(doc, {

            startY: 63,

            head: [[
                "Test Case ID",
                "Test Case Title",
                "Status",
                "Executed At",
                "Remarks"
            ]],

            body: history.map(item => [

                item.testCaseId,

                item.title,

                item.status,

                new Date(item.executionTime)
                    .toLocaleString(),

                item.remarks || ""

            ]),

            headStyles: {
                fillColor: [52, 152, 219],
                textColor: 255,
                fontStyle: "bold"
            },

            alternateRowStyles: {
                fillColor: [245, 245, 245]
            },

            styles: {
                fontSize: 10,
                cellPadding: 3
            }

        });

        doc.save(
            `Execution_History_${new Date()
                .toISOString()
                .split("T")[0]}.pdf`
        );
    };

    const [history, setHistory] = useState([]);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {

        try {

            const response =
                await fetch(
                    "http://localhost:8080/api/dashboard/execution-history"
                );

            const data =
                await response.json();

            setHistory(data);

        } catch (error) {

            console.log(error);

        }
    };

    return (

        <div className="history-container">

            <h1 className="history-title">
                Execution History
            </h1>
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "15px"
                }}
            >

                <button
                    onClick={exportPDF}
                    className="pdf-btn"
                >
                    Export PDF
                </button>

            </div>

            <div className="history-card">

                <table className="history-table">

                    <thead>

                        <tr>
                            <th>ID</th>
                            <th>Test Case</th>
                            <th>Status</th>
                            <th>Executed At</th>
                            <th>Remarks</th>
                        </tr>

                    </thead>

                    <tbody>

                        {history.map(item => (

                            <tr key={item.executionTime}>

                                <td>{item.testCaseId}</td>

                                <td>
                                    {item.title}
                                </td>

                                <td>

                                    <span
                                        className={
                                            item.status === "PASS"
                                                ? "status-pass"
                                                : "status-fail"
                                        }
                                    >
                                        {item.status}
                                    </span>

                                </td>

                                <td>
                                    {
                                        new Date(
                                            item.executionTime
                                        ).toLocaleString()
                                    }
                                </td>

                                <td>
                                    {item.remarks}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default ExecutionHistoryPage;