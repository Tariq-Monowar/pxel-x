import "./home.css";
import { useEffect, useState } from "react";
import { useDataFirebase } from "../../context/CteateDataContext";
import { MdOutlineFileDownload } from "react-icons/md";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import { useAuthFirebase } from "../../context/AuthContext";

const Home = () => {
  const dataFirebase = useDataFirebase();
  const authFirebase = useAuthFirebase();

  const [allImage, setAllImage] = useState([]);
  const [filterImage, setFilterImage] = useState(allImage);

  useEffect(() => {
    setFilterImage(allImage);
  }, [allImage]);
  // const filterImage = allImage
  console.log(filterImage);
  const [currentWidth, setCurrentWidth] = useState(window.innerWidth);
  const userUid = localStorage.getItem("UId");

  useEffect(() => {
    dataFirebase.setForceByUpdate(!dataFirebase.forceByUpdate);
    // forceByUpdate, setForceByUpdate
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dataFirebase.allImage;
        if (data && data.length > 0) {
          setAllImage(data);
        }
      } catch (error) {
        console.error("Error reading images:", error.message);
      }
    };

    fetchData();
  }, [dataFirebase]);

  console.log(allImage);

  const handleDownload = async (imageUrl, imageName) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = imageName;

      // Trigger a click on the link to start the download
      a.click();

      // Clean up the URL.createObjectURL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error.message);
    }
  };

  // const likeImage = async (id) => {
  //   try {
  //     const res = await dataFirebase.LikeImage(id);
  //     console.log(res);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const likeImage = async (id) => {
  //   try {
  //     const likedImage = allImage.find((img) => img.id === id);

  //     if (likedImage) {
  //       // Check if the user's UID is already in the likedBy array
  //       const alreadyLiked = likedImage.likedBy.includes(userUid);

  //       // Update the local state immediately for a faster UI response
  //       setAllImage((prevImages) =>
  //         prevImages.map((img) =>
  //           img.id === id
  //             ? {
  //                 ...img,
  //                 likedBy: alreadyLiked
  //                   ? img.likedBy.filter((uid) => uid !== userUid) // Decrement
  //                   : img.likedBy.concat(userUid), // Increment
  //               }
  //             : img
  //         )
  //       );

  //       // Trigger the asynchronous LikeImage function
  //       await dataFirebase.LikeImage(id);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const likeImage = async (id) => {
    try {
      const likedImage =
        authFirebase?.currentUserData && allImage.find((img) => img.id === id);
      console.log(likedImage);
      if (likedImage) {
        // Check if the user's UID is already in the likedBy array
        const alreadyLiked = likedImage.likedBy.includes(userUid);

        // Update the local state immediately for a faster UI response
        setAllImage((prevImages) =>
          prevImages.map((img) =>
            img.id === id
              ? {
                  ...img,
                  likedBy: alreadyLiked
                    ? img.likedBy.filter((uid) => uid !== userUid) // Decrement
                    : img.likedBy.concat(userUid), // Increment
                }
              : img
          )
        );

        // Trigger the asynchronous LikeImage function with the increment parameter
        await dataFirebase.LikeImage(id, !alreadyLiked);
      }
    } catch (error) {
      console.log(error);
    }
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


const searchImage = (e) => {
  let input = e.target.value;
  const results = allImage.filter((item) => {
    const words = item.name.toLowerCase().split(' ');
    return words.some((word) => word.startsWith(input.toLowerCase()));
  });
  setFilterImage(results);
};

  return (
    <div style={{}}>
      {allImage?.length > 0 && (
        <div className="aleing">
          <p className="titleforSearrch">search Image</p>
          {/* <p className="descForSearch">ডেলিগেট কোড দিয়ে অনুসন্ধান করুন</p> */}
          <div id="search">
            <svg viewBox="0 0 420 60" xmlns="http://www.w3.org/2000/svg">
              <rect class="bar" />

              <g class="magnifier">
                <circle class="glass" />
                <line class="handle" x1="32" y1="32" x2="44" y2="44"></line>
              </g>

              {/* <g class="sparks">
              <circle class="spark" />
              <circle class="spark" />
              <circle class="spark" />
            </g> */}

              <g class="burst pattern-one">
                <circle class="particle circle" />
                <path class="particle triangle" />
                <circle class="particle circle" />
                <path class="particle plus" />
                <rect class="particle rect" />
                <path class="particle triangle" />
              </g>
              <g class="burst pattern-two">
                <path class="particle plus" />
                <circle class="particle circle" />
                <path class="particle triangle" />
                <rect class="particle rect" />
                <circle class="particle circle" />
                <path class="particle plus" />
              </g>
              <g class="burst pattern-three">
                <circle class="particle circle" />
                <rect class="particle rect" />
                <path class="particle plus" />
                <path class="particle triangle" />
                <rect class="particle rect" />
                <path class="particle plus" />
              </g>
            </svg>
            <input
              onChange={searchImage}
              type="search"
              aria-label="অনুসন্ধান"
            />
          </div>
        </div>
      )}
      <div className="gallery">
        {filterImage.map((image) => {
          console.log(image?.userData?.photoURL);
          let liked = image?.likedBy?.includes(userUid);

          return (
            <>
              <div key={image.id} className="images">
                <div className="setImage">
                  <span
                    onClick={() => likeImage(image.id)}
                    className="like-content"
                  >
                    {/* <FavoriteBorderIcon color="action" /> */}
                    <Badge
                      badgeContent={image?.likedBy?.length}
                      color="success"
                    >
                      {liked ? (
                        <FavoriteIcon
                          color="action"
                          style={{ fill: "#d3405c" }}
                        />
                      ) : (
                        <FavoriteBorderIcon color="action" />
                      )}
                    </Badge>
                  </span>
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
                    <img src={image?.userData?.photoURL} alt={image.name} />
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
    </div>
  );
};

export default Home;

[
  {
    name: "seam",
    searchItam: "Pre SD fser fdfa  sdf",
  },
  {
    name: "takim",
    searchItam: "fds4 fgrdgrgy45 rfg",
  },
];
