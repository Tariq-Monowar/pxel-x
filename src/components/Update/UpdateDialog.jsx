import "./UpdateDialog.css";
import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useDataFirebase } from "../../context/CteateDataContext";
import { resizeImage } from "../../util/ResizeImage";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function UpdateDialog({ open, handleClose, data }) {
  console.log(data);
  const firebase = useDataFirebase();
  const [image, setImage] = useState("-");
  const [imageName, setImageName] = useState("");
  const [loading, setLoading] = useState(false);
  // setImageName()

  

  const resetState = () => {
    setImage("-");
    setImageName("");
  };

  const submitData = async (e) => {
    e.preventDefault();
    // let resizedImage;
    // if (image) {
    //   resizedImage = await resizeImage(image, 500, 500);
    // } else {
    //   // Handle the case when no image is selected
    //   console.log("No image selected");
    // }
    setLoading(true);

    let imageData;

    if (image !== "-") {
      imageData = await resizeImage(image, 500, 500);
    } else {
      // Provide a default value or handle the case accordingly
      imageData = null;
    }
    console.log(imageData);
    try {
      const res = await firebase.updateImage(
        data?.id,
        imageData,
        imageName,
        data?.image
      );
      // console.log(res)
      if (res) {
        setLoading(false);
        handleClose();
        resetState();
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
      onClose={() => {
        handleClose();
        resetState();
      }}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle className="titleDeleteDialog">
        {"Update Image"}{" "}
        <span
          onClick={() => {
            handleClose();
            resetState();
          }}
          className="closeIcon"
        >
          &#10006;
        </span>
      </DialogTitle>

      <DialogContent className="dialogContent">
        <DialogContentText id="alert-dialog-slide-description">
          <form onSubmit={submitData}>
            {image ? (
              <div className="seletedImages seletedImage">
                <span className="crosImage">
                  <IoClose
                    style={{ marginTop: "0px" }}
                    onClick={() => setImage(null)}
                    className="crosImageIcon"
                  />
                </span>

                <img
                  className="setInnerImages setInnerImage"
                  style={{ marginTop: "0px" }}
                  src={
                    image instanceof File
                      ? URL.createObjectURL(image)
                      : data?.image
                  }
                  alt=""
                />
              </div>
            ) : (
              <div>
                <input
                  onChange={(e) => setImage(e.target.files[0])}
                  type="file"
                  accept="image/*"
                  name="imageName"
                  id="imageForUploade"
                />
                <label
                  htmlFor="imageForUploade"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <FaCloudUploadAlt className="imageForUploade" />
                </label>
              </div>
            )}
            <div>
              <input
                onChange={(e) => setImageName(e.target.value)}
                value={imageName}
                type="text"
                className="uploadeImageTexts uploadeImageText"
                placeholder={data?.name}
              />
            </div>{" "}
            <div style={{ textAlign: "center" }}>
              {loading ? (
                <CircularProgress
                  sx={{
                    width: "26px!important",
                    height: "26px!important",
                    marginTop: "5px",
                    marginBottom: "10px"
                  }}
                  color="inherit"
                />
              ) : (
                <button className="uploadeImageButtons uploadeImageButton" type="Submit">
                  Submit
                </button>
              )}
            </div>
          </form>
        </DialogContentText>
      </DialogContent>
      {/* <DialogActions>
        <Button onClick={handleClose}>Disagree</Button>
        <Button onClick={handleClose}>Agree</Button>
      </DialogActions> */}
    </Dialog>
  );
}
