import { useNavigate } from "react-router-dom";
import { useVenueStore } from "../../stores";
import VenueForm from "../../components/VenueForm";

const CreateVenue = () => {
  const createVenue = useVenueStore((state) => state.createVenue);
  const navigate = useNavigate();

  const handleCreateVenue = async (venueData) => {
    const response = await createVenue(venueData);
    if (response) navigate(`/venues/${response.id}`);
  };

  document.title = "Create Venue - Holidaze";

  return <VenueForm onSubmit={handleCreateVenue} />;
};

export default CreateVenue;
