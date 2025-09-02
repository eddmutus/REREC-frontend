// Assets
import transformer from "../assets/transformer.jpg";
import { Typography } from "@mui/material";

const Home = () => {
  return (
    <div className="overlay">
      <img src={transformer} alt="transformer" className="overlay-img" />
      <Typography variant="h1" className="overlay-text">
        Community Health Care
      </Typography>
      <q className="overlay-quote">Transforming Healthcare, Together</q>
    </div>
  );
};

export default Home;
