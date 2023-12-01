import {
  Skeleton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from "@mui/material";

const ListSkeleton = () => (
  <>
    <ListItem>
      <ListItemAvatar>
        <Skeleton variant="circular" width={40} height={40} />
      </ListItemAvatar>
      <ListItemText
        primary={<Skeleton variant="text" width="50%" />}
        secondary={<Skeleton variant="text" width="30%" />}
      />
      <Skeleton
        variant="rectangular"
        width={14}
        height={24}
        style={{ marginLeft: 16 }}
      />
    </ListItem>
    <Divider />
  </>
);

export default ListSkeleton;
