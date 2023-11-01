import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useVenueStore } from "../../stores";

import VenueForm from "../../components/VenueForm";
import { Typography } from "@mui/material";

const EditVenue = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const updateVenue = useVenueStore((state) => state.updateVenue);
  const fetchVenueById = useVenueStore((state) => state.fetchVenueById);

  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchVenueData = async () => {
      const venueData = await fetchVenueById(id);
      setInitialData(venueData);
    };
    fetchVenueData();
  }, [id, fetchVenueById]);

  const handleUpdateVenue = async (venueData) => {
    await updateVenue(id, venueData);
    navigate(`/venues/${id}`);
  };

  // or isLoading?
  if (!initialData) {
    return <Typography>Loading...</Typography>;
  }

  document.title = `Edit ${initialData.name}`;

  return <VenueForm initialData={initialData} onSubmit={handleUpdateVenue} />;
};

export default EditVenue;
