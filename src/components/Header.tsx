import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <AppBar sx={{ backgroundColor: "#000" }} position="static">
      <Toolbar sx={{ justifyContent: "space-evenly" }}>
        <Button color="inherit" onClick={() => navigate("/")}>
          <Typography variant="h4">Home</Typography>
        </Button>
        <Button color="inherit" onClick={() => navigate("/explorer")}>
          <Typography variant="h4">Explore</Typography>
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
