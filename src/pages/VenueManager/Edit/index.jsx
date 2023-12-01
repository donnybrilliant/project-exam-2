import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useVenueStore, useFetchStore } from "../../../stores";
import VenueForm from "../../../components/VenueForm";
import { Typography } from "@mui/material";

const EditVenue = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const updateVenue = useVenueStore((state) => state.updateVenue);
  const fetchVenueById = useVenueStore((state) => state.fetchVenueById);
  const isLoading = useFetchStore((state) => state.isLoading);
  const [dataLoaded, setDataLoaded] = useState(false);

  const [initialData, setInitialData] = useState({});

  useEffect(() => {
    const fetchVenueData = async () => {
      const venueData = await fetchVenueById(id);
      setInitialData(venueData);
      setDataLoaded(true);
    };
    fetchVenueData();
  }, [id, fetchVenueById]);

  const handleUpdateVenue = async (venueData) => {
    await updateVenue(id, venueData);
    navigate(`/venues/${id}`);
  };

  /*   // or isLoading?
  if (!initialData) {
    return <Typography>Loading...</Typography>;
  }
  

  document.title = `Edit ${initialData.name}`; */

  return (
    <VenueForm
      key={dataLoaded}
      initialData={initialData}
      onSubmit={handleUpdateVenue}
    />
  );
};

export default EditVenue;
