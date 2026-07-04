from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json

app = Flask(__name__)
CORS(app)

API_KEY = ""


@app.route('/analyze', methods=['POST'])
def analyze():

    try:

        data = request.json

        title = data.get("title", "")
        description = data.get("description", "")
        steps = data.get("steps", "")
        expectedResult = data.get("expectedResult", "")
        priority = data.get("priority", "")

        prompt = f"""
You are an AI Software Testing Agent.

Analyze this software test case.

Title:
{title}

Description:
{description}

Steps:
{steps}

Expected Result:
{expectedResult}

Determine the priority independently.

Do NOT simply repeat the user's selected priority.

You must evaluate the test case based on:
- Business impact
- Risk
- User impact
- Criticality of functionality

If the selected priority is incorrect, recommend a different one.

Return ONLY JSON.

Format:

{{
"scenarioAnalysis":"short explanation",

"missingScenarios":[
"missing scenario 1",
"missing scenario 2",
"missing scenario 3"
],

"priorityRecommendation":"priority reason"
}}

Generate minimum 3 missing scenarios.
Never leave missingScenarios empty.
"""

        response = requests.post(

            url="https://openrouter.ai/api/v1/chat/completions",

            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json"
            },

            json={

                "model": "openai/gpt-3.5-turbo",

                "messages": [

                    {
                        "role": "user",
                        "content": prompt
                    }

                ]

            }

        )

        result = response.json()

        content = result['choices'][0]['message']['content']

        print("AI RAW RESPONSE:")
        print(content)

        parsed = json.loads(content)

        scenario_analysis = parsed.get(
            "scenarioAnalysis",
            ""
        )

        missing_scenarios = parsed.get(
            "missingScenarios",
            []
        )

        priority_recommendation = parsed.get(
            "priorityRecommendation",
            ""
        )

        if not missing_scenarios:

            missing_scenarios = [

                "Boundary value validation",

                "Invalid input validation",

                "Security testing"

            ]

        print("Scenario:", scenario_analysis)
        print("Missing:", missing_scenarios)
        print("Priority:", priority_recommendation)

        return jsonify({

            "scenarioAnalysis":
                scenario_analysis,

            "missingScenarios":
                missing_scenarios,

            "priorityRecommendation":
                priority_recommendation

        })

    except Exception as e:

        print("ERROR:", e)

        return jsonify({

            "scenarioAnalysis":
                "Backend Error",

            "missingScenarios": [

                "Unable to generate missing scenarios"

            ],

            "priorityRecommendation":
                "Error"

        })


if __name__ == '__main__':
    app.run(debug=True)