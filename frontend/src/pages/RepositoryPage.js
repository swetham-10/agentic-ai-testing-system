import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function RepositoryPage() {

    const [testCases, setTestCases] =
        useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        loadTestCases();

    }, []);

    const loadTestCases = async () => {

        try {

            const response =
                await fetch(
                    "http://localhost:8080/api/testcases"
                );

            const data =
                await response.json();

            setTestCases(data);

        } catch (error) {

            console.log(error);

        }

    };

    const deleteTestCase = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this test case?"
            );

        if (!confirmed) return;

        try {

            const response =
                await fetch(
                    `http://localhost:8080/api/testcase/${id}`,
                    {
                        method: "DELETE"
                    }
                );

            if (!response.ok) {

                throw new Error(
                    "Delete failed"
                );

            }

            alert(
                "Test Case Deleted Successfully"
            );

            loadTestCases();

        } catch (error) {

            console.log(error);

            alert(
                "Unable to delete test case"
            );

        }

    };

    return (

        <div className="app">

            <div className="hero-section">

                <h1>
                    📋 Test Case Repository
                </h1>

                <p>
                    View all stored test cases
                </p>

            </div>

            <div className="form-card">

                <table
                    className="repository-table"
                >

                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>Title</th>

                            <th>Priority</th>

                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {testCases.map(
                            (testCase) => (

                                <tr
                                    key={testCase.id}
                                >

                                    <td>
                                        {testCase.id}
                                    </td>

                                    <td>
                                        {testCase.title}
                                    </td>

                                    <td>
                                        {testCase.priority}
                                    </td>

                                    <td>

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/?editId=${testCase.id}`
                                                )
                                            }
                                        >
                                            ✏ Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                deleteTestCase(
                                                    testCase.id
                                                )
                                            }
                                        >
                                            🗑 Delete
                                        </button>

                                    </td>

                                </tr>

                            )
                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default RepositoryPage;