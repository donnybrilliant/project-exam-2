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
import CreateVenue from "./pages/Create";
import EditVenue from "./pages/EditVenue";
import Feedback from "./components/Feedback";
import ConfirmationDialog from "./components/ConfirmationDialog";
import VenuesPage from "./pages/Venues";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="venues" element={<VenuesPage />} />
          <Route path="venues/:id" element={<VenuePage />} />
          {/*   add access control */}
          <Route
            path="venues/:id/edit"
            element={
              <OwnerRoute>
                <EditVenue />
              </OwnerRoute>
            }
          />
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
            path="/dashboard/venues/create"
            element={
              <PrivateRoute>
                <CreateVenue />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<h1>Not Found</h1>} />
        </Route>
      </Routes>
      <Feedback />
      <ConfirmationDialog />
    </>
  );
}

export default App;
