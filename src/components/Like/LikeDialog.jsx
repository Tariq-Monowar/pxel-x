import "./likeDialog.css";
import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Button from "@mui/material/Button";

import Badge from "@mui/material/Badge";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { useDataFirebase } from "../../context/CteateDataContext";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function LikeDialog({ open, handleClose, data }) {
  const firebse = useDataFirebase();
  const [likeData, setLikeData] = useState([]);
  console.log(data?.likedBy);
  useEffect(() => {
    const likeData = async () => {
      try {
        const result = await firebse.getUserInfoListWithLikedImages(
          data?.likedBy
        );
        if (result) setLikeData(result);
      } catch (error) {
        console.log(error);
      }
    };
    likeData();
  }, [firebse, open]);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => {
        setLikeData(null);
        handleClose();
      }}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle className="titleDeleteDialogLike">
        {"Reacted your image"}{" "}
        <span onClick={handleClose} className="closeIconLike closeIcon">
          &#10006;
        </span>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          <div>
            {likeData &&
              likeData.map((like) => {
                return (
                  <div className="likeContaner" key={like.id}>
                    <div className="avatorLike">
                      <img src={like.photoURL} alt="" />
                      <FavoriteIcon
                        color="action"
                        style={{ fill: "#d3405c", fontSize: "19px", marginLeft: "-16px", marginBottom: "-2px" }}
                      />
                    </div>

                    {/* <Badge
                      badgeContent={5}
                      color="success"
                    > */}

                    {/* </Badge> */}
                    <p>{like.displayName}</p>
                  </div>
                );
              })}
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{marginTop: "-30px"}}>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
