import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import VenuePage from "./pages/Venue";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="venues/:id" element={<VenuePage />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Route>
    </Routes>
  );
}

export default App;
