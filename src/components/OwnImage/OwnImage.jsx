import { useEffect, useState, useRef } from "react";
import { useDataFirebase } from "../../context/CteateDataContext";
import { MdOutlineFileDownload } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import "./ownImage.css";

import * as React from "react";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
// import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
// import SaveIcon from '@mui/icons-material/Save';
// import PrintIcon from '@mui/icons-material/Print';
// import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from "@mui/icons-material/MoreVert";

import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";

import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import FavoriteIcon from "@mui/icons-material/Favorite";

import DeleteDialog from "../delete/DeleteDialog";
import UpdateDialog from "../Update/UpdateDialog";
import LikeDialog from './../Like/LikeDialog';

const actions = [
  // { icon: <FavoriteIcon />, name: "Like" },
  { icon: <UpdateIcon />, name: "update", action: "UpdateeImage" },
  { icon: <DeleteIcon />, name: "delete", action: "deleteImage" },
];

const OwnImage = () => {
  const dataContext = useDataFirebase();
  const [ownImageData, setOwnImageData] = useState([]);
  const [currentWidth, setCurrentWidth] = useState(window.innerWidth);
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    dataContext.setForceByUpdate(!dataContext.forceByUpdate);
  }, []);

  //delete image-------------
  const [openDelete, setOpenDelete] = useState(false);
  const handleClickOpen = () => {
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  const deleteImage = (e) => {
    setImageData(e);
    setOpenDelete(true);
  };

  //update image-------------
  const [openUpdate, setOpenUpdate] = useState(false);
  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };
  const UpdateeImage = (e) => {
    setImageData(e);
    setOpenUpdate(true);
  };

  //Like image-------------
  const [openLike, setOpenLike] = useState(false);
  const handleCloseLike = () => {
    setOpenLike(false);
  };
  const LikeImage = (e) => {
    setImageData(e);
    setOpenLike(true);
  };

  useEffect(() => {
    const handleResize = () => {
      setCurrentWidth(window.innerWidth);
    };

    // Add event listener to listen for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove event listener when component is unmounted
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  // console.log(currentWidth);

  useEffect(() => {
    const getData = async () => {
      const res = await dataContext.ownImage;
      setOwnImageData(res);
    };
    getData();
  }, [dataContext]);
  console.log(ownImageData);
  
  return (
    <div style={{ margin: "50px 0" }}>
      <div className="gallery">
        {ownImageData &&
          ownImageData.map((image) => {
            console.log(image?.userData?.photoURL);
            return (
              <>
                <div key={image.id} className="images">
                  <div
                    className={
                      ownImageData.length > 0 ? "setImage" : "setImages"
                    }
                  >
                    {/* <FaHeart /> */}
                    <Box
                      sx={{
                        height: 320,
                        transform: "translateZ(0px)",
                        flexGrow: 1,
                      }}
                    >
                      <SpeedDial
                        ariaLabel="SpeedDial basic example"
                        // color="secondary"
                        sx={{ right: 0 }}
                        direction="left"
                        FabProps={{
                          sx: {
                            ...(currentWidth < 450
                              ? {
                                  bgcolor: "#ffffff00",
                                  "&:hover": {
                                    bgcolor: "#ffffff00",
                                  },
                                  width: "15px",
                                  height: "35px",
                                  borderRadius: "10px",
                                  marginRight: "10px",
                                  marginTop: "0px",
                                  boxShadow: "none",
                                }
                              : {
                                  bgcolor: "#fff",
                                  "&:hover": {
                                    bgcolor: "#fff",
                                  },
                                  width: "35px",
                                  height: "35px",
                                  borderRadius: "10px",
                                  marginRight: "10px",
                                  marginTop: "0px",
                                }),
                          },
                        }} //#3f3e3e
                        icon={
                          <MoreVertIcon
                            sx={{
                              fontSize: "30px",
                              color: currentWidth > 450 ? "#7f7f7f" : "#3f3e3e",
                            }}
                          />
                        }
                      >
                        {/* <BsThreeDotsVertical /> */}

                        <SpeedDialAction
                          icon={
                            <Badge badgeContent={image?.likedBy?.length} color="success">
                              <FavoriteIcon color="action" />
                            </Badge>
                          }
                          tooltipTitle={"Like"}
                          onClick={()=>LikeImage(image)}
                          FabProps={{
                            sx: {
                              width: "35px",
                              height: "35px",
                              transform:
                                currentWidth < 450
                                  ? "scale(0.8)"
                                  : "scale(1.0)",
                              // marginBottom: "-1px",
                              marginTop: "12px",

                              marginRight: currentWidth < 450 ? "-8px" : "",
                            },
                          }}
                        />
                        {actions.map((action) => (
                          <SpeedDialAction
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            onClick={() => {
                              if (action.action === "deleteImage") {
                                deleteImage(image);
                              } else if (action.action === "UpdateeImage") {
                                UpdateeImage(image);
                              }
                            }}
                            FabProps={{
                              sx: {
                                width: "35px",
                                height: "35px",
                                // marginBottom: "0px"
                                transform:
                                  currentWidth < 450
                                    ? "scale(0.8)"
                                    : "scale(1.0)",
                                marginTop: "12px",
                                marginRight: currentWidth < 450 ? "-2px" : "",
                              },
                            }}
                          />
                        ))}
                      </SpeedDial>
                    </Box>

                    {/* <span className="like-content">
                      <FaRegHeart className="like" />
                    </span> */}
                  </div>
                  <img
                    className="gallery-image"
                    style={{ width: "100%" }}
                    src={image.image}
                    alt={image.name}
                    draggable
                  />
                  <div className="imageAuth">
                    {image?.userData?.photoURL ? (
                      <img src={image?.userData?.photoURL} alt={image?.name} />
                    ) : (
                      <div className="ifImageNull">
                        {image?.userData?.displayName.slice(0, 2)}
                      </div>
                    )}

                    <p>{image?.userData?.displayName}</p>
                    <div className="download">
                      <button
                        onClick={() => handleDownload(image.image, image.name)}
                      >
                        <MdOutlineFileDownload className="download-icon" />{" "}
                        {currentWidth > 650 && "Download"}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            );
          })}
      </div>
      <DeleteDialog
        open={openDelete}
        handleClose={handleCloseDelete}
        data={imageData}
      />

      <UpdateDialog
        open={openUpdate}
        handleClose={handleCloseUpdate}
        data={imageData}
      />

      <LikeDialog
        open={openLike}
        handleClose={handleCloseLike}
        data={imageData}
      />
    </div>
  );
};

export default OwnImage;
