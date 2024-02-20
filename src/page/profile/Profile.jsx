import React, { useEffect, useState } from "react";
import { useAuthFirebase } from "../../context/AuthContext";
import "./profile.css";
import { FaPenNib } from "react-icons/fa";
import { IoMdImages } from "react-icons/io";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import OwnImage from "../../components/OwnImage/OwnImage";
import { useDataFirebase } from "../../context/CteateDataContext";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const Profile = () => {
  const firebase = useAuthFirebase();
  const dataFirebase = useDataFirebase()
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [updateUserImage, setUpdateUserImage] = useState(null);
  const [userName, setUserName] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  

  console.log(updateUserImage);
  useEffect(() => {
    setUserData(firebase.currentUserData);
  }, [firebase.currentUserData]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const submitUpdateData = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = await firebase.updateProfileData(
      userName,
      updateUserImage,
      userData?.photoURL,
      userData?.uid
    );
    if (data.success == true) {
      handleClose();
      setLoading(false);
      console.log(data.user);
    }
  };

  const signOut = () => {
    firebase.logout();
    navigate("/");
  };

  return (
    <>
      <div style={{ paddingTop: "70px" }}>
        <div className="ProfileContainer">
          <div className="profilePicture">
            {userData?.photoURL ? (
              <div className="imageurl">
                <img
                  className="imageAvatar"
                  src={userData?.photoURL}
                  alt={userData?.displayName}
                />
              </div>
            ) : (
              <div className="withoutImageurl" draggable>
                <span>{userData?.displayName?.slice(0, 2)}</span>
              </div>
            )}
          </div>
          <div className="UpDateImage">
            <FaPenNib className="updateIcon" onClick={handleClickOpen} />
          </div>
          <h1 className="displayName">{userData?.displayName}</h1>
          <button onClick={signOut} className="logout-btn">
            Log Out
          </button>
        </div>
        <OwnImage />
      </div>

      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Update Profile
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          sx={{
            textAlign: "center",
          }}
          dividers
        >
          <form onSubmit={submitUpdateData} className="userupdateSection">
            {updateUserImage ? (
              <div className="userImg">
                <span
                  onClick={() => setUpdateUserImage(null)}
                  className="crosImage"
                >
                  <IoClose className="crosImageIcon-profile" />
                </span>
                <img
                  className="userImages"
                  src={URL.createObjectURL(updateUserImage)}
                />
              </div>
            ) : (
              <label className="upDateIconImage" htmlFor="images">
                <IoMdImages className="icon" />
              </label>
            )}

            <input
              style={{
                display: "none",
              }}
              onChange={(e) => setUpdateUserImage(e.target.files[0])}
              accept="image/*"
              type="file"
              name="image"
              id="images"
            />
            <input
              className="userNameInput"
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
              type="text"
              name="userName"
              placeholder={userData?.displayName}
            />

            <Button
              type="submit"
              id="submitBtn"
              sx={{
                textAlign: "center",
                textTransform: "none",
                borderRadius: "10px",
                background: "#8d8d8d",
                width: "270px",
                marginTop: "25px",
                paddingTop: "4px",
                paddingBottom: "4px",
                fontSize: "17px",
                "&:hover": {
                  background: "#707070",
                },
              }}
              variant="contained"
              disableElevation
            >
              {loading ? (
                <Box sx={{ width: "10px" }}>
                  <CircularProgress size={25} color="inherit" />
                </Box>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
};

export default Profile;
