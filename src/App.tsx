import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Landing from "./pages/landing";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
