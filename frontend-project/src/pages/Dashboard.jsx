
import React, { useEffect, useState } from "react";

const API_URL = "/api/tasks";

const Dashboard = () => {
	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location = "/login";
	};
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [status, setStatus] = useState("pending");
	const [editId, setEditId] = useState(null);

	const token = localStorage.getItem("token");

	const fetchTasks = async () => {
		setLoading(true);
		setError("");
		try {
			const res = await fetch(API_URL, {
				headers: { Authorization: `Bearer ${token}` },
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Failed to fetch tasks");
			setTasks(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchTasks();
	}, []);

	const handleCreate = async (e) => {
		e.preventDefault();
		setError("");
		try {
			const res = await fetch(API_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ title, description }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Failed to create task");
			setTitle("");
			setDescription("");
			fetchTasks();
		} catch (err) {
			setError(err.message);
		}
	};

	const handleEdit = (task) => {
		setEditId(task._id);
		setTitle(task.title);
		setDescription(task.description);
		setStatus(task.status);
	};

	const handleUpdate = async (e) => {
		e.preventDefault();
		setError("");
		try {
			const res = await fetch(`${API_URL}/${editId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ title, description, status }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Failed to update task");
			setEditId(null);
			setTitle("");
			setDescription("");
			setStatus("pending");
			fetchTasks();
		} catch (err) {
			setError(err.message);
		}
	};

	const handleDelete = async (id) => {
		setError("");
		try {
			const res = await fetch(`${API_URL}/${id}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Failed to delete task");
			fetchTasks();
		} catch (err) {
			setError(err.message);
		}
	};

		return (
			<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f6fa" }}>
				<div style={{ maxWidth: 700, width: "100%", margin: "0 auto" }}>
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
						<h2 style={{ textAlign: "center", margin: 0 }}>Dashboard</h2>
						<button onClick={handleLogout} style={{ padding: "8px 18px", borderRadius: 4, background: "#c23616", color: "#fff", border: "none", fontWeight: "bold", fontSize: 16, cursor: "pointer" }}>Logout</button>
					</div>
					<form onSubmit={editId ? handleUpdate : handleCreate} style={{ background: "#fff", padding: 24, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", marginBottom: 32 }}>
						<h3 style={{ marginBottom: 16 }}>{editId ? "Edit Task" : "Create Task"}</h3>
						<div style={{ marginBottom: 16 }}>
							<label htmlFor="title" style={{ display: "block", marginBottom: 6 }}>Title</label>
							<input
								id="title"
								type="text"
								value={title}
								onChange={e => setTitle(e.target.value)}
								required
								style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
							/>
						</div>
						<div style={{ marginBottom: 16 }}>
							<label htmlFor="description" style={{ display: "block", marginBottom: 6 }}>Description</label>
							<input
								id="description"
								type="text"
								value={description}
								onChange={e => setDescription(e.target.value)}
								required
								style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
							/>
						</div>
						{editId && (
							<div style={{ marginBottom: 16 }}>
								<label htmlFor="status" style={{ display: "block", marginBottom: 6 }}>Status</label>
								<select
									id="status"
									value={status}
									onChange={e => setStatus(e.target.value)}
									style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
								>
									<option value="pending">Pending</option>
									<option value="in-progress">In Progress</option>
									<option value="completed">Completed</option>
								</select>
							</div>
						)}
						{error && <div style={{ color: "red", marginBottom: 16 }}>{error}</div>}
						<button type="submit" style={{ width: "100%", padding: 10, borderRadius: 4, background: editId ? "#273c75" : "#44bd32", color: "#fff", border: "none", fontWeight: "bold" }}>{editId ? "Update Task" : "Create Task"}</button>
						{editId && (
							<button type="button" onClick={() => { setEditId(null); setTitle(""); setDescription(""); setStatus("pending"); }} style={{ width: "100%", marginTop: 8, padding: 10, borderRadius: 4, background: "#e1b12c", color: "#fff", border: "none", fontWeight: "bold" }}>Cancel</button>
						)}
					</form>
					<div style={{ background: "#fff", padding: 24, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
						<h3 style={{ marginBottom: 16 }}>Your Tasks</h3>
						{loading ? (
							<div>Loading...</div>
						) : tasks.length === 0 ? (
							<div>No tasks found.</div>
						) : (
							<ul style={{ listStyle: "none", padding: 0 }}>
								{tasks.map(task => (
									<li key={task._id} style={{ marginBottom: 18, borderBottom: "1px solid #eee", paddingBottom: 12 }}>
										<div style={{ fontWeight: "bold", fontSize: 18 }}>{task.title}</div>
										<div style={{ color: "#555", marginBottom: 6 }}>{task.description}</div>
										<div style={{ fontSize: 14, color: task.status === "completed" ? "#44bd32" : task.status === "in-progress" ? "#e1b12c" : "#273c75" }}>
											Status: {task.status}
										</div>
										<button onClick={() => handleEdit(task)} style={{ marginRight: 8, padding: "6px 16px", borderRadius: 4, background: "#273c75", color: "#fff", border: "none", fontWeight: "bold" }}>Edit</button>
										<button onClick={() => handleDelete(task._id)} style={{ padding: "6px 16px", borderRadius: 4, background: "#c23616", color: "#fff", border: "none", fontWeight: "bold" }}>Delete</button>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			</div>
		);
};

export default Dashboard;
