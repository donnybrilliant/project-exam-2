import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Venue from "./pages/Venue";

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="venues/:id" element={<Venue />} />
      <Route path="*" element={<h1>Not Found</h1>} />
    </Routes>
  );
}

export default App;
