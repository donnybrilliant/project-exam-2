import {
  ImageList,
  ImageListItem,
  Modal,
  Paper,
  IconButton,
  Box,
} from "@mui/material";
import Close from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import useVenueStore from "../../stores/venueStore";

const ImageGallery = ({ media }) => {
  const { openImageIndex, setOpenImageIndex } = useVenueStore();

  // Handle next image
  const handleNext = () => {
    setOpenImageIndex((currentIndex) =>
      currentIndex < media.length - 1 ? currentIndex + 1 : 0
    );
  };

  // Handle previous image
  const handlePrevious = () => {
    setOpenImageIndex((currentIndex) =>
      currentIndex > 0 ? currentIndex - 1 : media.length - 1
    );
  };

  const handleKeyDown = (event) => {
    // Check if the left arrow key was pressed
    if (event.key === "ArrowLeft") {
      handlePrevious();
    }
    // Check if the right arrow key was pressed
    if (event.key === "ArrowRight") {
      handleNext();
    }
  };
  return (
    <>
      <ImageList cols={Math.min(media.length, 3)}>
        {media?.map((item, index) => (
          <ImageListItem
            key={item}
            onClick={() => setOpenImageIndex(index)}
            sx={{ cursor: "pointer" }}
          >
            <img src={item} alt={`Photo ` + (index + 1)} loading="lazy" />
          </ImageListItem>
        ))}
      </ImageList>
      {openImageIndex !== null && (
        <Modal
          open={openImageIndex !== null}
          onClose={() => setOpenImageIndex(null)}
          onKeyDown={(event) => handleKeyDown(event)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper
            sx={{
              position: "relative",
              bgcolor: "background.paper",
              p: 1,
              paddingBottom: 0,
              m: 2,
              width: { md: "80vw", lg: "70vw", xl: "60vw" },
            }}
          >
            <IconButton
              size="small"
              aria-label="Close"
              onClick={() => setOpenImageIndex(null)}
              sx={{
                position: "absolute",
                top: 15,
                right: 15,
                bgcolor: "rgba(255, 255, 255, 0.5)",
                zIndex: 1,
              }}
            >
              <Close />
            </IconButton>
            <Box
              sx={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "50%", // This makes the Box take up half the width
              }}
              onClick={handlePrevious}
            >
              <IconButton
                aria-label="Previous"
                sx={{
                  position: "absolute",
                  left: 20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "rgba(255, 255, 255, 0.5)", // Set background color here
                }}
              >
                <ChevronLeftIcon />
              </IconButton>
            </Box>
            <Box
              component="img"
              sx={{
                objectFit: "contain",
                width: "100%",
                height: "100%",
              }}
              src={media[openImageIndex]}
              alt={`Photo ` + (openImageIndex + 1)}
            />
            <Box
              sx={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: "50%", // This makes the Box take up half the width
              }}
              onClick={handleNext}
            >
              <IconButton
                aria-label="Next"
                sx={{
                  position: "absolute",
                  right: 20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "rgba(255, 255, 255, 0.5)", // Set background color here
                }}
              >
                <ChevronRightIcon />
              </IconButton>
            </Box>
          </Paper>
        </Modal>
      )}
    </>
  );
};

export default ImageGallery;
