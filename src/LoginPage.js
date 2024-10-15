// LoginPage.js
import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle email/password login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await Auth.signIn(email, password);
      navigate("/profile"); // Redirect to profile page after login
    } catch (err) {
      setError("Failed to login. Please check your credentials.");
    }
  };

  // Handle Google login with Cognito
  const handleGoogleLogin = async () => {
    try {
      await Auth.federatedSignIn({ provider: "Google" });
      navigate("/profile");
    } catch (err) {
      setError("Failed to login with Google.");
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>

      <div className="oauth-login">
        <p>Or login with:</p>
        <button onClick={handleGoogleLogin}>Login with Google</button>
      </div>
    </div>
  );
};

export default LoginPage;