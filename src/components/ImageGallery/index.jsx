import { useGalleryStore } from "../../stores";
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

// This component is used to display a gallery of images that can be clicked on to view in a modal
const ImageGallery = ({ media }) => {
  const openImageIndex = useGalleryStore((state) => state.openImageIndex);
  const setOpenImageIndex = useGalleryStore((state) => state.setOpenImageIndex);
  const goToNextImage = useGalleryStore((state) => state.goToNextImage);
  const goToPreviousImage = useGalleryStore((state) => state.goToPreviousImage);

  const handleKeyDown = (event) => {
    // Check if the left arrow key was pressed
    if (event.key === "ArrowLeft") {
      goToPreviousImage(media.length);
    }
    // Check if the right arrow key was pressed
    if (event.key === "ArrowRight") {
      goToNextImage(media.length);
    }
  };
  return (
    <>
      <ImageList cols={Math.min(media.length, 3)}>
        {media?.map((item, index) => (
          <ImageListItem
            key={`${item}-${index}`}
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
              width: { sm: "80vw", md: "60vw", lg: "49vw", xl: "39vw" },
              maxHeight: "100vh",
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
                width: "50%",
              }}
              onClick={() => goToPreviousImage(media.length)}
            >
              <IconButton
                aria-label="Previous"
                sx={{
                  position: "absolute",
                  left: 20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "rgba(255, 255, 255, 0.5)",
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
                width: "50%",
              }}
              onClick={() => goToNextImage(media.length)}
            >
              <IconButton
                aria-label="Next"
                sx={{
                  position: "absolute",
                  right: 20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "rgba(255, 255, 255, 0.5)",
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
