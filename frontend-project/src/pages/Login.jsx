
import React, { useState } from "react";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
			e.preventDefault();
			setError("");
			try {
				const res = await fetch("/api/auth/login", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password }),
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.message || "Login failed");
				localStorage.setItem("token", data.token);
				window.location = "/dashboard";
			} catch (err) {
				setError(err.message || "Login failed");
			}
	};
	return (
		<div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f6fa" }}>
			<form onSubmit={handleSubmit} style={{ background: "#fff", padding: 32, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", width: 350 }}>
				<h2 style={{ marginBottom: 24, textAlign: "center" }}>Login</h2>
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
				<button type="submit" style={{ width: "100%", padding: 10, borderRadius: 4, background: "#273c75", color: "#fff", border: "none", fontWeight: "bold" }}>Login</button>
				<div style={{ marginTop: 16, textAlign: "center" }}>
					Don't have an account? <a href="/signup" style={{ color: "#273c75", textDecoration: "underline", cursor: "pointer" }}>Sign up</a>
				</div>
			</form>
		</div>
	);
};

export default Login;
