import React, { useState } from "react";
import Layout from "./Layout";
import "../styles/DeleteTaskStyle.css";

// --- Dummy Data (simulate sqlite) ---
const DUMMY_TASKS = [
  {
    id: 'T123',
    name: 'Finish Project Report',
    description: 'Compile and submit the final report.',
    dateTime: '2025-05-29T10:00',
    priority: 'High',
    status: 'Not Completed',
    subtasks: [
      {
        id: 'T123-1',
        name: 'Write Introduction',
        description: 'Draft the introduction section.',
        dateTime: '2025-05-28T15:00',
        priority: 'Medium',
        status: 'Completed',
      },
      {
        id: 'T123-2',
        name: 'Collect Data',
        description: 'Gather all survey results.',
        dateTime: '2025-05-28T16:00',
        priority: 'High',
        status: 'Not Completed',
      },
    ],
  },
  {
    id: 'T124',
    name: 'Team Meeting',
    description: 'Weekly team standup meeting.',
    dateTime: '2025-05-30T09:00',
    priority: 'Medium',
    status: 'Not Completed',
    subtasks: [],
  },
];

export default function DeleteTaskPage() {
  const [tasks, setTasks] = useState(DUMMY_TASKS);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [status, setStatus] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  // Find the selected task from the list
  const selectedTask = tasks.find(t => t.id === selectedTaskId);

  // Handle task selection
  const handleSelectTask = (e) => {
    setSelectedTaskId(e.target.value);
    setStatus('');
    setShowConfirm(false);
  };

  // Delete the selected task
  const handleDelete = (e) => {
    e.preventDefault();
    if (!selectedTaskId) {
      setStatus('⚠️ Please select a task to delete.');
      return;
    }
    setShowConfirm(true);
  };

  // Confirm and delete
  const confirmDelete = () => {
    setTasks(tasks.filter(t => t.id !== selectedTaskId));
    setStatus(`✅ Task "${selectedTask?.name}" has been deleted.`);
    setSelectedTaskId('');
    setShowConfirm(false);
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowConfirm(false);
    setStatus('');
  };

  return (
    <Layout>
      <div className="delete-task-card">
        <h1 className="delete-task-title">🗑️ Delete Task</h1>
        <div className="delete-task-subtitle">
          Select a task below to view its details and delete it.<br/>
          <span className="delete-task-warning">Warning:</span> This action cannot be undone.
        </div>
        <form className="delete-task-form" onSubmit={handleDelete} autoComplete="off">
          <label className="delete-task-label" htmlFor="task-select">Task</label>
          <select
            id="task-select"
            value={selectedTaskId}
            onChange={handleSelectTask}
            className="delete-task-select"
          >
            <option value="">-- Choose a task --</option>
            {tasks.map(task => (
              <option key={task.id} value={task.id}>{task.name} ({task.id})</option>
            ))}
          </select>
          {selectedTask && (
            <div className="delete-task-details">
              <div><b>Description:</b> {selectedTask.description}</div>
              <div><b>Date &amp; Time:</b> {new Date(selectedTask.dateTime).toLocaleString()}</div>
              <div><b>Priority:</b> {selectedTask.priority}</div>
              <div><b>Status:</b> {selectedTask.status}</div>
              {selectedTask.subtasks.length > 0 && (
                <div className="delete-task-subtask-list">
                  <b>Subtasks:</b>
                  <ul>
                    {selectedTask.subtasks.map(st => (
                      <li key={st.id}>
                        <span className="delete-task-subtask-name">{st.name}</span>
                        <span className="delete-task-subtask-info">
                          (Priority: {st.priority}, Status: {st.status})
                        </span>
                        <div className="delete-task-subtask-desc">
                          {st.description} | {new Date(st.dateTime).toLocaleString()}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          <button type="submit" className="delete-task-btn">
            Delete Selected Task
          </button>
        </form>
        {showConfirm && (
          <div className="delete-task-confirm-modal">
            <div className="delete-task-confirm-content">
              <div>⚠️ Are you sure you want to delete <b>{selectedTask?.name}</b>?</div>
              <div className="delete-task-confirm-actions">
                <button className="delete-task-confirm-btn" onClick={confirmDelete}>Yes, Delete</button>
                <button className="delete-task-cancel-btn" onClick={cancelDelete}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        {status && <div className="delete-task-status">{status}</div>}
      </div>
    </Layout>
  );
}