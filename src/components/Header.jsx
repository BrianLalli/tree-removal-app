import { Button } from "@mui/material";
import supabase from "../utils/supabaseClient";

const Header = () => (
  <Button
    onClick={() => {
      const { error } = supabase.auth.signOut();
      if (error) return console.error("error signOut", error);
    }}
  >
    Logout
  </Button>
);

export default Header;
