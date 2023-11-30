import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import VenuePage from "./pages/Venue";
import Login from "./pages/Login";
import Register from "./pages/Register";
import {
  PublicOnlyRoute,
  PrivateRoute,
  OwnerRoute,
} from "./components/AccessControl";
import Dashboard from "./pages/Dashboard";
import RegisterVenue from "./pages/VenueManager/Register";
import EditVenue from "./pages/VenueManager/Edit";
import Feedback from "./components/Feedback";
import ConfirmationDialog from "./components/ConfirmationDialog";
import VenuesPage from "./pages/Venues";
import VenueManager from "./pages/VenueManager";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="venues" element={<VenuesPage />} />
          <Route path="venues/:id" element={<VenuePage />} />

          <Route
            path="login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="register"
            element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            }
          />

          <Route
            path="dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route path="venuemanager" element={<VenueManager />} />
          <Route path="venuemanager/register" element={<RegisterVenue />} />
          <Route path="venuemanager/edit/:id" element={<EditVenue />} />

          <Route path="*" element={<h1>Not Found</h1>} />
        </Route>
      </Routes>
      <Feedback />
      <ConfirmationDialog />
    </>
  );
}

export default App;
