import {Button, Menu, MenuItem} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, {useState} from "react";
import {useAppDispatch} from "../../app/hooks";
import {NavLink} from "react-router-dom";
import {UserFields} from "../../types";
import {logout} from "../../features/users/userThunks.ts";
import {unsetUser} from "../../features/users/userSlice.ts";
import axiosAPI from "../../axiosAPI.ts";
import Avatar from "@mui/material/Avatar";

interface Props {
  user: UserFields;
}

const UserMenu: React.FC<Props> = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useAppDispatch();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(unsetUser());
    handleClose();
  };
  return (
    <>
        <Grid display='flex' mr='30px'>
            <Button
            onClick={handleClick}
            color="inherit"
            sx={{
                fontWeight: "bold",
                transition: "color 0.3s",
                "&:hover": {
                    textDecoration: "underline",
                },
            }}
        >
            Hello, {user.displayName}!
        </Button>
                <Avatar
                    src={`${axiosAPI.defaults.baseURL}/${user.avatar}`}
                    title={user.username}
                    sx={{
                        width: "40px",
                        height: "40px",
                    }}
                />
        </Grid>
        <Button
            sx={{
                fontWeight: "bold",
                color: "#2196f3",
                border: "2px solid #2196f3",
                borderRadius: "10px",
                textTransform: "uppercase",
                margin: "0 8px",
                padding: "6px 24px",
                transition: "all 0.3s",
                "&:hover": {
                    backgroundColor: "#2196f3",
                    color: "#fff",
                },
            }}
            component={NavLink}
            to="/track_history"
            color="inherit"
        >
            Track History
        </Button>
      {user && (
        <Button
            sx={{
                fontWeight: "bold",
                color: "#2196f3",
                border: "2px solid #2196f3",
                borderRadius: "10px",
                textTransform: "uppercase",
                margin: "0 8px",
                padding: "6px 24px",
                transition: "all 0.3s",
                "&:hover": {
                    backgroundColor: "#2196f3",
                    color: "#fff",
                },
            }}
            component={NavLink}
            to="/new_album"
            color="inherit"
        >
           New album
        </Button>
      )}
        {user && (
            <Button
                sx={{
                    fontWeight: "bold",
                    color: "#2196f3",
                    border: "2px solid #2196f3",
                    borderRadius: "10px",
                    textTransform: "uppercase",
                    margin: "0 8px",
                    padding: "6px 24px",
                    transition: "all 0.3s",
                    "&:hover": {
                        backgroundColor: "#2196f3",
                        color: "#fff",
                    },
                }}
                component={NavLink}
                to="/new_artist"
                color="inherit"
            >
                New artist
            </Button>
        )}
        {user && (
            <Button
                sx={{
                    fontWeight: "bold",
                    color: "#2196f3",
                    border: "2px solid #2196f3",
                    borderRadius: "10px",
                    textTransform: "uppercase",
                    margin: "0 8px",
                    padding: "6px 24px",
                    transition: "all 0.3s",
                    "&:hover": {
                        backgroundColor: "#2196f3",
                        color: "#fff",
                    },
                }}
                component={NavLink}
                to="/new_track"
                color="inherit"
            >
                New track
            </Button>
        )}
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
          <MenuItem component={NavLink} to="/profile">Profile</MenuItem>
          <MenuItem component={NavLink} to="/my_account">My account</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
