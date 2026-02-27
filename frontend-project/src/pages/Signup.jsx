
import React, { useState } from "react";

const Signup = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, password }),
			});
			let data = {};
			try {
				data = await res.json();
			} catch (jsonErr) {
				if (!res.ok) throw new Error("Signup failed (invalid response)");
			}
			if (!res.ok) throw new Error(data.message || "Signup failed");
			setSuccess("Signup successful! You can now login.");
			setName("");
			setEmail("");
			setPassword("");
		} catch (err) {
			setError(err.message || "Signup failed");
		}
	};

	return (
		<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f6fa" }}>
			<form onSubmit={handleSubmit} style={{ background: "#fff", padding: 32, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", width: 350 }}>
				<h2 style={{ marginBottom: 24, textAlign: "center" }}>Signup</h2>
				<div style={{ marginBottom: 16 }}>
					<label htmlFor="name" style={{ display: "block", marginBottom: 6 }}>Name</label>
					<input
						id="name"
						type="text"
						value={name}
						onChange={e => setName(e.target.value)}
						required
						style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
					/>
				</div>
				<div style={{ marginBottom: 16 }}>
					<label htmlFor="email" style={{ display: "block", marginBottom: 6 }}>Email</label>
					<input
						id="email"
						type="email"
						value={email}
						onChange={e => setEmail(e.target.value)}
						required
						style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
					/>
				</div>
				<div style={{ marginBottom: 16 }}>
					<label htmlFor="password" style={{ display: "block", marginBottom: 6 }}>Password</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={e => setPassword(e.target.value)}
						required
						style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
					/>
				</div>
				{error && <div style={{ color: "red", marginBottom: 16 }}>{error}</div>}
				{success && <div style={{ color: "green", marginBottom: 16 }}>{success}</div>}
				<button type="submit" style={{ width: "100%", padding: 10, borderRadius: 4, background: "#44bd32", color: "#fff", border: "none", fontWeight: "bold" }}>Signup</button>
			</form>
		</div>
	);
};

export default Signup;
