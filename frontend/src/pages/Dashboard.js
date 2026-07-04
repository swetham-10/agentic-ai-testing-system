import React, { useEffect, useState } from "react";

import "./Dashboard.css";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";

import {
    FaClipboardList,
    FaCheckCircle,
    FaTimesCircle,
    FaPlayCircle
} from "react-icons/fa";

function Dashboard() {

    const [dashboard, setDashboard] = useState({

        totalTestCases: 0,
        executedTestCases: 0,
        passCount: 0,
        failCount: 0,
        notExecutedCount: 0,
        recentExecutions: []

    });

    useEffect(() => {

        loadDashboard();

    }, []);

    const loadDashboard = async () => {

        try {

            const response = await fetch(
                "http://localhost:8080/api/dashboard"
            );

            const data = await response.json();

            setDashboard(data);

        } catch (error) {

            console.log(error);

        }

    };

    const pieData = [

        {
            name: "PASS",
            value: dashboard.passCount
        },

        {
            name: "FAIL",
            value: dashboard.failCount
        },

        {
            name: "NOT EXECUTED",
            value: dashboard.notExecutedCount
        }

    ];

    const COLORS = [
        "#22c55e",
        "#ef4444",
        "#9ca3af"
    ];

    const total =
        dashboard.totalTestCases || 1;

    const passPercentage =
        Math.round(
            (dashboard.passCount / total) * 100
        );

    const failPercentage =
        Math.round(
            (dashboard.failCount / total) * 100
        );

    const notExecutedPercentage =
        Math.round(
            (dashboard.notExecutedCount / total) * 100
        );

    return (

        <div className="dashboard-page">

            <h1 className="dashboard-title">
                Dashboard
            </h1>

            <p className="dashboard-subtitle">
                Overview of your testing activities
            </p>

            {/* Top Cards */}

            <div className="stats-grid">

                <div className="stat-card">

                    <div className="stat-icon blue-bg">
                        <FaClipboardList />
                    </div>

                    <h3>Total Test Cases</h3>

                    <h1 className="blue">
                        {dashboard.totalTestCases}
                    </h1>

                    <p>All created test cases</p>

                </div>

                <div className="stat-card">

                    <div className="stat-icon green-bg">
                        <FaCheckCircle />
                    </div>

                    <h3>Passed Executions</h3>

                    <h1 className="green">
                        {dashboard.passCount}
                    </h1>

                    <p>Successfully passed</p>

                </div>

                <div className="stat-card">

                    <div className="stat-icon red-bg">
                        <FaTimesCircle />
                    </div>

                    <h3>Failed Executions</h3>

                    <h1 className="red">
                        {dashboard.failCount}
                    </h1>

                    <p>Test cases failed</p>

                </div>

                <div className="stat-card">

                    <div className="stat-icon purple-bg">
                        <FaPlayCircle />
                    </div>

                    <h3>Total Executions</h3>

                    <h1 className="purple">
                        {dashboard.executedTestCases}
                    </h1>

                    <p>All test executions</p>

                </div>

            </div>
            {/* Table + Pie Chart */}

            <div className="dashboard-content">

                {/* Recent Executions */}

                <div className="card">

                    <div className="card-header">
                        Recent Test Executions
                    </div>

                    <table className="execution-table">

                        <thead>

                            <tr>

                                <th>Test Case</th>

                                <th>Status</th>

                                <th>Executed At</th>

                            </tr>

                        </thead>

                        <tbody>

                            {dashboard.recentExecutions?.map(
                                (item, index) => (

                                    <tr key={index}>

                                        <td>{item.title}</td>

                                        <td>

                                            <span
                                                className={
                                                    item.status === "PASS"
                                                        ? "pass-badge"
                                                        : "fail-badge"
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

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>

                {/* Pie Chart */}

                <div className="card">

                    <div className="card-header">
                        <h3>Execution Summary</h3>
                    </div>

                    <div className="chart-container">

                        <ResponsiveContainer width="70%" height={420}>

                            <PieChart>

                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    innerRadius={90}
                                    outerRadius={140}
                                    paddingAngle={2}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell
                                            key={index}
                                            fill={COLORS[index]}
                                        />
                                    ))}
                                </Pie>

                                <text
                                    x="50%"
                                    y="48%"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fontSize="28"
                                    fontWeight="bold"
                                >
                                    {dashboard.totalTestCases}
                                </text>

                                <text
                                    x="50%"
                                    y="58%"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fontSize="14"
                                    fill="#666"
                                >
                                    Total
                                </text>

                                <Tooltip />

                            </PieChart>

                        </ResponsiveContainer>

                        <div className="summary-legend">

                            <div className="legend-item">

                                <span className="legend-dot green"></span>

                                <div>

                                    <strong>Passed</strong>

                                    <br />

                                    {dashboard.passCount}
                                    {" "}
                                    ({passPercentage}%)

                                </div>

                            </div>

                            <div className="legend-item">

                                <span className="legend-dot red"></span>

                                <div>

                                    <strong>Failed</strong>

                                    <br />

                                    {dashboard.failCount}
                                    {" "}
                                    ({failPercentage}%)

                                </div>

                            </div>

                            <div className="legend-item">

                                <span className="legend-dot gray"></span>

                                <div>

                                    <strong>Not Executed</strong>

                                    <br />

                                    {dashboard.notExecutedCount}
                                    {" "}
                                    ({notExecutedPercentage}%)

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Dashboard;