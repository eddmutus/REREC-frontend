// Assets
import transformer from "../assets/transformer.jpg";
import { Typography } from "@mui/material";

const Home = () => {
  return (
    <div className="overlay">
      <img src={transformer} alt="transformer" className="overlay-img" />
      <Typography variant="h1" className="overlay-text">
        Kaing'utu Electrification Project
      </Typography>
      <q className="overlay-quote">A green energy-driven nation</q>
    </div>
  );
};

export default Home;
