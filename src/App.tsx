import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import Header from "./components/Header";
import Home from "./components/Home";
// import Explorer from "./components/Explorer";

// MUI imports
import { CssBaseline } from "@mui/material";
// import FacilityDetail from "./components/FacilityDetail";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <CssBaseline />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/explorer" element={<Explorer />} /> */}
          {/* <Route path="/facilities/:id" element={<FacilityDetail />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
