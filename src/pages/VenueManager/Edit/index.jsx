import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useVenueStore } from "../../../stores";
import VenueForm from "../../../components/VenueForm";

// This component is used to display a form for editing a venue
const EditVenue = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const updateVenue = useVenueStore((state) => state.updateVenue);
  const fetchVenueById = useVenueStore((state) => state.fetchVenueById);
  const [dataLoaded, setDataLoaded] = useState(false);

  const [initialData, setInitialData] = useState({});

  // Fetch venue when id changes
  useEffect(() => {
    const fetchVenueData = async () => {
      const venueData = await fetchVenueById(id);
      setInitialData(venueData);
      setDataLoaded(true);
    };
    fetchVenueData();
  }, [id, fetchVenueById]);

  // This function is used to update the venue
  const handleUpdateVenue = async (venueData) => {
    await updateVenue(id, venueData);
    navigate(`/venues/${id}`);
  };

  document.title = `Edit ${initialData.name}`;

  return (
    <VenueForm
      key={dataLoaded}
      initialData={initialData}
      onSubmit={handleUpdateVenue}
    />
  );
};

export default EditVenue;
