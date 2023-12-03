import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useVenueStore } from "../../../stores";
import VenueForm from "../../../components/VenueForm";

// This component is used to display a form for registering a venue
const RegisterVenue = () => {
  const createVenue = useVenueStore((state) => state.createVenue);
  const navigate = useNavigate();

  // This function is used to create the venue
  const handleCreateVenue = async (venueData) => {
    const response = await createVenue(venueData);
    if (response) navigate(`/venues/${response.id}`);
  };

  return (
    <>
      <Helmet>
        <title>Register Venue - Holidaze</title>
        <meta name="description" content="Register your Holidaze venue" />
      </Helmet>
      <VenueForm onSubmit={handleCreateVenue} />;
    </>
  );
};

export default RegisterVenue;
