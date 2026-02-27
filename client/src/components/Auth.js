import React, { useState } from "react";
import { register, login } from "../services/api";

export default function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const resp = isRegister
      ? await register(username, pin)
      : await login(username, pin);

    setLoading(false);

    if (resp.status === 200) {
      onLogin(resp.data);
    } else {
      setError(resp.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="auth-backdrop">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="suit-icon">&#9824;</span>
            <span className="suit-icon red">&#9829;</span>
            <span className="suit-icon">&#9827;</span>
            <span className="suit-icon red">&#9830;</span>
          </div>
          <h1 className="auth-title">Royal Casino</h1>
          <p className="auth-subtitle">Blackjack & Poker</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              minLength={2}
              maxLength={20}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>PIN</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN (min 4 digits)"
              minLength={4}
              required
            />
          </div>
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" className="btn-gold" disabled={loading}>
            {loading ? "..." : isRegister ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div className="auth-toggle">
          <button
            className="btn-link"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
          >
            {isRegister
              ? "Already have an account? Sign in"
              : "New player? Create account"}
          </button>
        </div>
      </div>
    </div>
  );
}
