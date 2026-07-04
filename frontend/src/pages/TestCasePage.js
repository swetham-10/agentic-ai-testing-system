import React, { useState, useEffect } from 'react';
import '../App.css';
import { useSearchParams } from "react-router-dom";

function TestCasePage() {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [steps, setSteps] = useState('');
    const [expectedResult, setExpectedResult] = useState('');
    const [priority, setPriority] = useState('');
    const [draftLoaded, setDraftLoaded] =
        useState(false);

    const [aiResult, setAiResult] = useState({
        scenarioAnalysis: '',
        missingScenarios: [],
        priorityRecommendation: ''
    });
    const [searchParams] =
        useSearchParams();

    const editId =
        searchParams.get("editId");
    console.log(
        "Edit ID = ",
        editId
    );



    useEffect(() => {

        if (editId) {

            setDraftLoaded(true);
            return;

        }

        const savedDraft =
            sessionStorage.getItem(
                "testCaseDraft"
            );

        if (savedDraft) {

            const draft =
                JSON.parse(savedDraft);

            setTitle(draft.title || "");
            setDescription(draft.description || "");
            setSteps(draft.steps || "");
            setExpectedResult(draft.expectedResult || "");
            setPriority(draft.priority || "");

            setAiResult(
                draft.aiResult || {
                    scenarioAnalysis: "",
                    missingScenarios: [],
                    priorityRecommendation: ""
                }
            );
        }

        setDraftLoaded(true);

    }, [editId]);


    useEffect(() => {

        if (!draftLoaded) return;

        if (editId) return;

        sessionStorage.setItem(
            "testCaseDraft",

            JSON.stringify({
                title,
                description,
                steps,
                expectedResult,
                priority,
                aiResult
            })

        );

    }, [
        draftLoaded,
        title,
        description,
        steps,
        expectedResult,
        priority,
        aiResult,
        editId
    ]);
    const [status, setStatus] = useState('');
    const [remarks, setRemarks] = useState('');

    const [savedTestCaseId, setSavedTestCaseId] = useState(null);

    const resetForm = () => {

        sessionStorage.removeItem(
            "testCaseDraft"
        );

        setTitle("");
        setDescription("");
        setSteps("");
        setExpectedResult("");

        setPriority("");
        setStatus("");
        setRemarks("");

        setAiResult({
            scenarioAnalysis: "",
            missingScenarios: [],
            priorityRecommendation: ""
        });

    };
    const validateFields = () => {

        if (
            !title.trim() ||
            !description.trim() ||
            !steps.trim() ||
            !expectedResult.trim() ||
            !priority.trim()
        ) {

            alert("Please fill all mandatory fields.");
            return false;

        }

        return true;

    };

    const loadTestCaseForEdit =
        async () => {

            try {

                const response =
                    await fetch(
                        `http://localhost:8080/api/testcase/${editId}`
                    );

                const data =
                    await response.json();
                console.log(data);

                setTitle(
                    data.title || ""
                );

                setDescription(
                    data.description || ""
                );

                setSteps(
                    data.steps || ""
                );

                setExpectedResult(
                    data.expectedResult || ""
                );

                setPriority(
                    data.priority || ""
                );

                setSavedTestCaseId(
                    data.id
                );

                console.log(
                    "Loading test case:",
                    editId
                );

            } catch (error) {

                console.log(error);

            }

        };

    useEffect(() => {

        if (!editId) return;

        loadTestCaseForEdit();

    }, [editId]);

    const saveTestCase = async () => {

        try {

            const payload = {

                title,
                description,
                steps,
                expectedResult,
                priority

            };

            const url = editId
                ? `http://localhost:8080/api/testcase/${editId}`
                : "http://localhost:8080/api/testcase";

            const method =
                editId ? "PUT" : "POST";

            const response =
                await fetch(url, {

                    method,

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(payload)

                });

            const data =
                await response.json();

            if (data.duplicate) {

                alert(
                    "Test Case Already Exists"
                );

                return;
            }

            if (editId) {

                alert(
                    "Test Case Updated Successfully"
                );

            } else {

                alert(
                    "Test Case Saved Successfully"
                );

                setSavedTestCaseId(
                    data.data?.id
                );
            }

        } catch (error) {

            console.error(error);

            alert(
                "Unable to save test case"
            );

        }

    };

    const analyzeWithAI = async () => {

        if (!validateFields()) return;

        try {

            const response = await fetch(
                "http://127.0.0.1:5000/analyze",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        title,
                        description,
                        steps,
                        expectedResult,
                        priority
                    })
                }
            );

            const data = await response.json();

            setAiResult(data);

        } catch (error) {

            alert("AI Server Not Running");

        }

    };

    const executeTest = async () => {

        if (!savedTestCaseId) {

            alert("Please save test case first");
            return;

        }

        if (!status) {

            alert("Please select PASS or FAIL");
            return;

        }

        try {

            const response = await fetch(
                "http://localhost:8080/api/execute",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        testCaseId: savedTestCaseId,
                        status: status,
                        remarks: remarks
                    })
                }
            );

            await response.json();

            alert("Execution Stored Successfully");

        } catch (error) {

            alert("Execution Failed");

        }

    };

    return (

        <div className="app">

            <div className="hero-section">

                <h1>
                    🤖 Agentic AI Testing System
                </h1>

                <p>
                    Intelligent AI Agents for Scenario Analysis,
                    Missing Scenario Detection,
                    Priority Recommendation and Test Execution.
                </p>

            </div>

            <div className="main-container">

                <div className="form-card">

                    <h2>📝 Create Test Case</h2>

                    <div className="form-group">

                        <label>
                            <span className="required">*</span>
                            Test Case Title
                        </label>

                        <input
                            type="text"
                            value={title}
                            placeholder="Enter Test Case Title"
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <label>
                            <span className="required">*</span>
                            Description
                        </label>

                        <textarea
                            value={description}
                            placeholder="Enter Description"
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <label>
                            <span className="required">*</span>
                            Test Steps
                        </label>

                        <textarea
                            value={steps}
                            placeholder="Enter Test Steps"
                            onChange={(e) => setSteps(e.target.value)}
                        />

                        <label>
                            <span className="required">*</span>
                            Expected Result
                        </label>

                        <textarea
                            value={expectedResult}
                            placeholder="Enter Expected Result"
                            onChange={(e) => setExpectedResult(e.target.value)}
                        />

                        <label>
                            <span className="required">*</span>
                            Priority
                        </label>

                        <input
                            type="text"
                            value={priority}
                            placeholder="High / Medium / Low"
                            onChange={(e) => setPriority(e.target.value)}
                        />

                    </div>

                    <div className="button-group">

                        <button
                            className="save-btn"
                            onClick={saveTestCase}
                        >
                            💾 Save Test Case
                        </button>

                        <button
                            className="ai-btn"
                            onClick={analyzeWithAI}
                        >
                            ⚡ Analyze With AI
                        </button>

                        <button
                            className="reset-btn"
                            onClick={resetForm}
                        >
                            Reset
                        </button>

                    </div>

                </div>

                <div className="agents-container">

                    <div className="agent-card analysis-card">

                        <h2>🧠 Scenario Analysis Agent</h2>

                        <p>
                            {aiResult.scenarioAnalysis}
                        </p>

                    </div>

                    <div className="agent-card missing-card">

                        <h2>🧪 Missing Scenario Agent</h2>

                        <ul>

                            {aiResult.missingScenarios?.map((item, index) => (

                                <li key={index}>
                                    {item}
                                </li>

                            ))}

                        </ul>

                    </div>

                    <div className="agent-card priority-card">

                        <h2>⚡ Priority Recommendation Agent</h2>

                        <p>
                            {aiResult.priorityRecommendation}
                        </p>

                    </div>

                    <div className="agent-card">

                        <h2>▶ Execute Test</h2>

                        <label>
                            <span className="required">*</span>
                            Status
                        </label>

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >

                            <option value="">
                                Select Status
                            </option>

                            <option value="PASS">
                                PASS
                            </option>

                            <option value="FAIL">
                                FAIL
                            </option>

                        </select>

                        <label>
                            Remarks
                        </label>

                        <textarea
                            value={remarks}
                            placeholder="Execution Remarks"
                            onChange={(e) => setRemarks(e.target.value)}
                        />

                        <button
                            className="execute-btn"
                            onClick={executeTest}
                        >
                            ▶ Execute Test
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default TestCasePage;