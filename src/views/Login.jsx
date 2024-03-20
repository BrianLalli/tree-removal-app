import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import supabase from "../utils/supabaseClient";
import { useAppContext } from "../context/appContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  return (
    <Auth
      supabaseClient={supabase}
      providers={[]}
      appearance={{
        theme: ThemeSupa,
        variables: {
          default: {
            colors: {
              brand: "green",
              brandAccent: "darkgreen",
              inputText: "white",
            },
          },
        },
      }}
    />
  );
};

export default Login;
