// frontend/src/components/VerifyEmail.jsx

import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/verify-email?token=${token}`
        );
        if (response.redirected) {
          // Extract JWT token from the redirected URL
          const url = new URL(response.url);
          const jwtToken = url.searchParams.get("token");
          if (jwtToken) {
            localStorage.setItem("token", jwtToken);
            navigate("/profile-completion");
          } else {
            navigate("/login");
          }
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error verifying email:", error);
        navigate("/login");
      }
    };

    if (token) {
      verifyEmail();
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  return <div>Verifying your email...</div>;
};

export default VerifyEmail;
