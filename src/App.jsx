import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import VenuePage from "./pages/Venue";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import RegisterVenue from "./pages/VenueManager/Register";
import EditVenue from "./pages/VenueManager/Edit";
import VenuesPage from "./pages/Venues";
import VenueManager from "./pages/VenueManager";
import {
  PublicOnlyRoute,
  PrivateRoute,
  OwnerRoute,
} from "./components/AccessControl";
import ConfirmationDialog from "./components/ConfirmationDialog";
import Feedback from "./components/Feedback";
import NotFound from "./components/NotFound";

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

          <Route
            path="venuemanager"
            element={
              <PrivateRoute>
                <VenueManager />
              </PrivateRoute>
            }
          />
          <Route
            path="venuemanager/register"
            element={
              <PrivateRoute>
                <RegisterVenue />
              </PrivateRoute>
            }
          />
          <Route
            path="venuemanager/edit/:id"
            element={
              <OwnerRoute>
                <EditVenue />
              </OwnerRoute>
            }
          />

          <Route path="*" element={<NotFound text="Not Found" />} />
        </Route>
      </Routes>
      <Feedback />
      <ConfirmationDialog />
    </>
  );
}

export default App;
