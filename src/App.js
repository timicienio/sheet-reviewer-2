import "./App.css";
import "bootswatch/dist/darkly/bootstrap.min.css";
import { Route, Redirect, Switch } from "react-router-dom";
import { Button, Container, Navbar } from "react-bootstrap";
import StartMenu from "./containers/StartMenu";
import Reviewer from "./containers/Reviewer";
import Configure from "./containers/Configure";
import InfoPopUp from "./components/InfoPopup";
import React, { useState, useEffect } from "react";

require("dotenv").config();

const App = () => {
  const [config, setConfig] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);

  // Google OAuth configuration
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const REDIRECT_URI =
    process.env.REACT_APP_REDIRECT_URI || "http://localhost:3000/auth/callback";
  const SCOPE =
    "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.profile openid";

  const BACKEND_URL = process.env.REACT_APP_BE_URL || "";

  useEffect(() => {
    // Check for existing authentication on page reload
    const token = localStorage.getItem("google_access_token");
    const userInfo = localStorage.getItem("google_user_info");

    if (token && userInfo && !isAuthenticated) {
      setAccessToken(token);
      setUser(JSON.parse(userInfo));
      setIsAuthenticated(true);
    }
  }, [isAuthenticated]);

  console.log(isAuthenticated);

  // Check for existing authentication on app load
  useEffect(() => {
    // Handle OAuth callback and exchange code for token
    const handleAuthCallback = async (code) => {
      try {
        // Note: In production, this should be done on your backend server
        // This is a simplified example for demonstration
        const response = await fetch(`${BACKEND_URL}/api/auth/google`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code, redirect_uri: REDIRECT_URI }),
        });

        const data = await response.json();

        if (data.access_token) {
          setAccessToken(data.access_token);
          localStorage.setItem("google_access_token", data.access_token);

          // Get user info
          const userResponse = await fetch(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            {
              headers: {
                Authorization: `Bearer ${data.access_token}`,
              },
            }
          );

          const userInfo = await userResponse.json();
          setUser(userInfo);
          localStorage.setItem("google_user_info", JSON.stringify(userInfo));
          setIsAuthenticated(true);

          // Redirect to /start after successful authentication
          window.location.replace("/start");
        }
      } catch (error) {
        console.error("Authentication failed:", error);
      }
    };

    // Handle OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (window.location.pathname === "/auth/callback") {
      // If on callback page and not authenticated, handle callback
      if (code && !isAuthenticated) {
        handleAuthCallback(code);
      }
      // If already authenticated, redirect to /start
      if (isAuthenticated) {
        window.location.replace("/start");
      }
    } else if (code && !isAuthenticated) {
      // If code is present but not on callback page, handle callback
      handleAuthCallback(code);
    }
  }, [isAuthenticated, REDIRECT_URI, BACKEND_URL]);

  // Initiate Google OAuth flow
  const handleGoogleLogin = () => {
    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(SCOPE)}&` +
      `access_type=offline&` +
      `prompt=consent`;

    window.location.href = authUrl;
  };

  // Logout function
  const handleLogout = () => {
    setIsAuthenticated(false);
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("google_access_token");
    localStorage.removeItem("google_user_info");
  };

  // Protected route wrapper
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return (
        <div className="text-center mt-5">
          <h3>Please sign in to access Google Sheets</h3>
          <Button
            variant="primary"
            onClick={handleGoogleLogin}
            className="mt-3"
          >
            Sign in with Google
          </Button>
        </div>
      );
    }
    return children;
  };

  return (
    <div className="App">
      <InfoPopUp
        version="2.0.0"
        show={showInfo}
        onHide={() => {
          setShowInfo(false);
        }}
      />
      <Navbar bg="light" expand="lg" fixed="top">
        <Navbar.Brand href="/start">👓 Sheet Reviewer 2 </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end navbar-buttons">
          {isAuthenticated && user && (
            <span className="me-3">Welcome, {user.name}!</span>
          )}
          <Button variant="light" onClick={() => setShowInfo(true)}>
            About
          </Button>
          {isAuthenticated && (
            <Button variant="light" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Navbar.Collapse>
      </Navbar>
      <Container className="App-body">
        <Switch>
          <Route exact path="/">
            <Redirect to="/start" />
          </Route>
          <Route path="/auth/callback">
            <div className="text-center mt-5">
              <p>Processing authentication...</p>
            </div>
          </Route>
          <Route path="/start">
            <ProtectedRoute>
              <StartMenu
                config={config}
                setConfig={setConfig}
                accessToken={accessToken}
              />
            </ProtectedRoute>
          </Route>
          <Route path="/reviewer">
            <ProtectedRoute>
              <Reviewer config={config} accessToken={accessToken} />
            </ProtectedRoute>
          </Route>
          <Route path="/configure">
            <ProtectedRoute>
              <Configure accessToken={accessToken} />
            </ProtectedRoute>
          </Route>
        </Switch>
      </Container>

      <p className="footer">
        Fine work by <a href="https://github.com/timicienio">timicienio</a> |
        總召對不起我不會再遲到了
      </p>
    </div>
  );
};

export default App;
