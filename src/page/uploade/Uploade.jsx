import "./uploade.css";
import React,{useEffect, useState } from "react";
import { useAuthFirebase } from "../../context/AuthContext";
import { firebaseApp } from "../../context/config";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useDataFirebase } from "../../context/CteateDataContext";
import tickSign from "../../assets/tickSign.png"

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { resizeImage } from "../../util/ResizeImage";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const Uploade = () => {
  const authFirebase = useAuthFirebase();
  const dataFirebase = useDataFirebase();
  
  const [userData, setUserData] = useState(null);
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [imageTag, setImageTag] = useState([]);
  const [progress, setProgress] = useState(0)
  const [isUploadCanceled, setUploadCanceled] = useState(false);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  useEffect(() => {
    setUserData(authFirebase.currentUserData);
  }, [authFirebase.currentUserData, authFirebase.updateProfileData]);

// Inside the Uploade component
const resetSubmitForm = () => {
  setImageName("")
  setImage(null)

}
const submitData = async (e) => {
  e.preventDefault();
  let resizedImage;
  if (image) {
    resizedImage = await resizeImage(image, 500, 500);
  } else {
    // Handle the case when no image is selected
    console.log("No image selected");
  }
  dataFirebase.setUoloadeStope(false)
  setOpen(true);
  
  // Progress callback function to update UI
  const updateProgress = (progress) => {
    setProgress(progress);
    if(progress === 100){
      setTimeout(() => {
        setOpen(false) 
        resetSubmitForm() 
      }, 1500);
      setTimeout(() => {
        resetSubmitForm() 
      }, 1000);
      

    }
    
  };
  await dataFirebase.uploadeImage(resizedImage, imageName, userData.uid, updateProgress)
};

const handleCloseUploade = ()=>{
  resetSubmitForm()
  setOpen(false) 
  dataFirebase.setUoloadeStope(true)
}


function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(progress)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

  // const handleKeyDown = (e) => {
  //   if (e.key === "Enter" && e.target.value.trim() !== "") {
  //     setImageTag([...imageTag, e.target.value.trim()]);
  //     e.target.value = "";
  //   }
  // };

  // const removeTag = (index) =>{
  //   console.log(index)
  //   setImageTag(imageTag.filter((el,i)=>i !== index))
  // }

  return (
    <div className="uploadeContainer">
      <div className="uploadeSection">
        <h1 className="uploadeTitle">Upload Image</h1>
        <form onSubmit={submitData}>
          {image ? (
            <div className="seletedImage">
              <span className="crosImage">
                <IoClose onClick={()=>setImage(null)} className="crosImageIcon" />
              </span>
              <img src={URL.createObjectURL(image)} alt="" />
            </div>
          ) : (
            <div>
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                accept="image/*"
                name="imageName"
                id="imageForUploade"
                required
              />
              <label htmlFor="imageForUploade">
                <FaCloudUploadAlt className="imageForUploade" />
              </label>
            </div>
          )}

          <div>
            <input
              onChange={(e) => setImageName(e.target.value)}
              value={imageName}
              type="text"
              className="uploadeImageText"
              placeholder="Image Name"
              required
            />
          </div>
          <button className="uploadeImageButton" type="Submit">
            Submit
          </button>
          {/* <div className="setTag">
            {imageTag &&
              imageTag.map((x,index) => {
                return (
                  <div key={index} className="tag-item">
                    <span className="tag-text">{x}</span>
                    <span onClick={()=>removeTag(index)} className="tag-close">&times;</span>
                  </div>
                );
              })}

            <input
              className="addTag"
              onKeyDown={handleKeyDown}
              placeholder="Add Tag...."
              type="text"
              name=""
              id=""
            />
          </div> */}
        </form>
      </div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle className="uploadeDialogTitle">{"Uploading your Image"}</DialogTitle>
        <DialogContent>
          <DialogContentText style={{textAlign: "center", marginTop: "20px"}} id="alert-dialog-slide-description">
            {/* {
              progress === 100?<img src={tickSign} style={{width: "87px",marginLeft: "-5px"}} />:<CircularProgressWithLabel style={{transform: 'scale(1.5)'}} value={progress} />

            } */}<CircularProgressWithLabel style={{transform: 'scale(1.5)'}} value={progress} />
            
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUploade}>cancel upload</Button>
          <Button onClick={handleClose}>Agree</Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default Uploade;
