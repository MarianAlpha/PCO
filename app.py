import json
import os
from flask import Flask, request, jsonify
from datetime import datetime

app = Flask(__name__)
DATA_FILE = 'data.json'

def load_data():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE) as f:
        return json.load(f)
    
def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

@app.route('/projects', methods=['GET'])
def get_projects():
    data = load_data()
    return jsonify(data["projects"])

@app.route('/projects', methods=['POST'])
def create_project():
    data = load_data()
    project = request.json
    project["id"] = len(data["projects"]) + 1
    project["tasks"] = []
    project["activities"] = []
    data["projects"].append(project)
    save_data(data)
    return jsonify({"message": "Project created!"}), 201

@app.route('/projects/<int:project_id>/tasks', methods=['POST'])
def add_task(project_id):
    data = load_data()
    task = request.json["task"]
    for project in data["projects"]:
        if project["id"] == project_id:
            project["tasks"].append(task)
            break
    save_data(data)
    return jsonify({"message": "Task added!"}), 200

@app.route('/projects/<int:project_id>/activities', methods=['POST'])
def add_activity(project_id):
    data = load_data()
    activity = {
        "date": datetime.now().strftime("%Y-%m-%d"),
        "description": request.json["description"]
    }
    for project in data["projects"]:
        if project["id"] == project_id:
            project["activities"].append(activity)
            break
    save_data(data)
    return jsonify({"message": "Activity added!"}), 200

@app.route('/report', methods=['GET'])
def generate_report():
    data = load_data()
    report = ""
    for project in data["projects"]:
        report += f"* {project['name']}:\n"
        for act in project["activities"]:
            report += f"   - {act['description']} ({act['date']})\n"
    return jsonify({"report": report}), 200

if __name__ == '__main__':
    app.run(debug=True)