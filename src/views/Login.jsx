import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import supabase from "../utils/supabaseClient";
import { useAppContext } from "../context/appContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo-with-letters-2.png";
import '../assets/styles//Login.css';

const Login = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  return (
    <div className="auth-page">
      <img src={logo} alt="Two Guys Tree Service" className="auth-logo" />
      <div className="auth-container"> {/* This div wraps the Auth component with responsive styles */}
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to manage your jobs</p>
        <Auth
          supabaseClient={supabase}
          providers={[]}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "#3ab649",
                  brandAccent: "#2a8f38",
                  brandButtonText: "white",
                  inputText: "white",
                  inputBorder: "rgba(255,255,255,0.15)",
                  inputBorderFocus: "#3ab649",
                  inputBorderHover: "rgba(255,255,255,0.3)",
                  inputLabelText: "rgba(255,255,255,0.7)",
                  anchorTextColor: "rgba(255,255,255,0.6)",
                  anchorTextHoverColor: "white",
                },
                radii: {
                  borderRadiusButton: "10px",
                  inputBorderRadius: "10px",
                },
                fonts: {
                  bodyFontFamily: "Inter, system-ui, sans-serif",
                  buttonFontFamily: "Inter, system-ui, sans-serif",
                  inputFontFamily: "Inter, system-ui, sans-serif",
                  labelFontFamily: "Inter, system-ui, sans-serif",
                },
              },
            },
          }}
        />
      </div>
    </div>
  );  
};

export default Login;
