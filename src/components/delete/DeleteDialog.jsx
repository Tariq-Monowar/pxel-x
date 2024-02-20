import "./deleteDialog.css";
import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Button from "@mui/material/Button";
import { useDataFirebase } from "../../context/CteateDataContext";
import CircularProgress from "@mui/material/CircularProgress";
import { Hidden } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DeleteDialog({ open, handleClose, data }) {
  const firebase = useDataFirebase();
  const [loading, setLoading] = useState(false);
  console.log(data?.id);

  const deleteImage = async () => {
    setLoading(true);
    try {
      const res = await firebase.deleteImage(data?.id, data?.image);
      console.log(res);
      if (res) {
        setLoading(false);
        handleClose();
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      sx={{
        width: "min(100vw, 550px)",
        margin: "0 auto",
        height: "100%",
      }}
    >
      <DialogTitle className="titleDeleteDialog">
        {"Delete Image"}{" "}
        <span onClick={handleClose} className="closeIcon">
          &#10006;
        </span>
      </DialogTitle>
      <DialogContent className="dialogContent">
        <DialogContentText id="alert-dialog-slide-description">
          <img className="showImageDeletDialog" src={data?.image} alt="" />
          {/* <h1>{data?.name}</h1> */}
          {/* <button onClick={deleteImage} className="deleteImageBtn">
            {loading ? (
              <CircularProgress
                sx={{
                  width: "25px!important",
                  height: "25px!important",
                  marginBottom: "-3px",
                }}
                color="inherit"
              />
            ) : (
              "Delete"
            )}
          </button> */}
          {loading ? (
            <CircularProgress
              sx={{
                width: "26px!important",
                height: "26px!important",
                marginLeft: "20px",
                marginTop: "16px",
              }}
              color="inherit"
            />
          ) : (
            <Button
              sx={{ fontSize: "16px", marginTop: "10px" }}
              onClick={deleteImage}
            >
              Delete
            </Button>
          )}
        </DialogContentText>
      </DialogContent>
      {/* <DialogActions>
        <Button onClick={handleClose}>Disagree</Button> 
        <Button onClick={handleClose}>Delete</Button>
      </DialogActions> */}
    </Dialog>
  );
}
