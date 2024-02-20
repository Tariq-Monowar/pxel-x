import { createContext, useContext, useEffect, useState } from "react";
import { firebaseApp } from "./config";
import { getAuth } from "firebase/auth";
// import admin from 'firebase-admin';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  setDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import {
  getStorage,
  uploadBytes,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  getMetadata,
} from "firebase/storage";
// import admin from 'firebase-admin'

const CreateDataContext = createContext(null);

const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const firebaseAuth = getAuth(firebaseApp);
export const useDataFirebase = () => useContext(CreateDataContext);

export const CreateDataContextProvider = ({ children }) => {
  const [allImage, setAllImage] = useState([]);
  const [ownImage, setOwnImage] = useState([]);
  const [forceByUpdate, setForceByUpdate] = useState(false);
  const [uploadeStope, setUoloadeStope] = useState(false);

  const createNewImage = async (image, name, uid) => {
    try {
      const imageRef = ref(storage, `uploads/images/${Date.now()}-${name}`);
      const uploadResult = await uploadBytes(imageRef, image);

      const docRef = await addDoc(collection(firestore, "image"), {
        name,
        imageURL: uploadResult.ref.fullPath,
        uid,
      });

      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error creating new listing:", error.message);
    }
  };

  //Uploade all image
  // const uploadeImage = async (image, name, uid, progressCallback) => {
  //   try {
  //     if (uploadeStope) {
  //       console.log("Upload canceled.");
  //       return; // Stop the upload if uploadeStope is true
  //     }

  //     const date = new Date().getTime();
  //     const storageRef = ref(storage, `/images/${date + uid}`);

  //     const uploadTask = uploadBytesResumable(storageRef, image);

  //     uploadTask.on(
  //       "state_changed",
  //       (snapshot) => {
  //         // You can use the snapshot to get the progress
  //         const progress =
  //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //         progressCallback(progress); // Call the progress callback function
  //       },
  //       (error) => {
  //         console.error("Error during upload:", error.message);
  //       },
  //       async () => {
  //         // Upload completed successfully, now you can get the download URL
  //         const downloadURL = await getDownloadURL(storageRef);

  //         // Save downloadURL or perform any other actions
  //         const docRef = await addDoc(collection(firestore, "image"), {
  //           image: downloadURL,
  //           name,
  //           uid,
  //         });
  //         setForceByUpdate(!forceByUpdate)
  //         console.log("Document written with ID:", docRef.id);
  //       }
  //     );

  //     // Check if uploadeStope is true before starting the upload
  //     if (uploadeStope) {
  //       console.log("Upload canceled before starting.");
  //       uploadTask.cancel(); // Cancel the upload task
  //       return; // Stop the upload if uploadeStope is true
  //     }
  //   } catch (error) {
  //     console.error("Error creating new listing:", error.message);
  //   }
  // };

  const uploadeImage = async (image, name, uid, progressCallback) => {
    try {
      if (uploadeStope) {
        console.log("Upload canceled.");
        return; // Stop the upload if uploadeStope is true
      }

      const date = new Date().getTime();
      const storageRef = ref(storage, `/images/${date + uid}`);

      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          progressCallback(progress); 
        },
        (error) => {
          console.error("Error during upload:", error.message);
        },
        async () => {
          // Upload completed successfully, now you can get the download URL
          const downloadURL = await getDownloadURL(storageRef);

          // Save downloadURL or perform any other actions
          const docRef = await addDoc(collection(firestore, "image"), {
            image: downloadURL,
            name,
            uid,
            likedBy: [],
          });
          setForceByUpdate(!forceByUpdate);
          // Update the local state for the specific image
          setAllImage((prevImages) => [
            ...prevImages,
            { id: docRef.id, image: downloadURL, name, uid },
          ]);
          setOwnImage((prevImages) => [
            ...prevImages,
            { id: docRef.id, image: downloadURL, name, uid },
          ]);
          console.log("Document written with ID:", docRef.id);
        }
      );

      if (uploadeStope) {
        console.log("Upload canceled before starting.");
        uploadTask.cancel(); // Cancel the upload task
        return; // Stop the upload if uploadeStope is true
      }
    } catch (error) {
      console.error("Error creating new listing:", error.message);
    }
  };

  useEffect(() => {
    const getAllImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "image"));
        const allImageList = [];

        for (const doc of querySnapshot.docs) {
          const imageData = { id: doc.id, ...doc.data() };
          allImageList.push(imageData);

          // Fetch user data using uid
          const userQuery = query(
            collection(firestore, "user"),
            where("uid", "==", imageData.uid)
          );

          const userSnapshot = await getDocs(userQuery);
          if (!userSnapshot.empty) {
            userSnapshot.forEach((userDoc) => {
              const userData = { id: userDoc.id, ...userDoc.data() };
              // console.log(userData);
              imageData.userData = userData;
            });
          } else {
            console.warn(`User data not found for uid: ${imageData.uid}`);
          }
        }

        if (allImageList.length > 0) {
          setAllImage(allImageList);
        }
      } catch (error) {
        console.error("Error fetching images:", error.message);
      }
    };

    getAllImages();
  }, [firestore, forceByUpdate]);

  useEffect(() => {
    const getAllImages = async () => {
      try {
        const userUid = localStorage.getItem("UId");

        // Fetch user data using uid from localStorage
        const userQuery = query(collection(firestore, "user"),where("uid", "==", userUid));

        const userSnapshot = await getDocs(userQuery);
        
        if (!userSnapshot.empty) {
          // Assuming there's only one user with the given uid
          const userDoc = userSnapshot.docs[0];
          const userData = { id: userDoc.id, ...userDoc.data() };
          
          // Now, fetch only the images associated with this user
          const imageQuery = query(collection(firestore, "image"),where("uid", "==", userUid));
          const imageSnapshot = await getDocs(imageQuery);
          const allImageList = imageSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            userData: userData,
          }));

          // Fetch the images where the user is included in the likedBy array
          // Fetch the images where the user is included in the likedBy array
          // const likedImageQuery = query(collection(firestore, "image"),where("likedBy", "array-contains", userUid));

          // const likedImageSnapshot = await getDocs(likedImageQuery);
          // console.log(likedImageList)
          // const likedImageList = likedImageSnapshot.docs.map((doc) => ({
          //   id: doc.id,
          //   ...doc.data(),
          //   userData: userData,
          // }));
        

          // console.log(likedImageList);

          if (allImageList.length >= 0) {
            // setAllImage(allImageList);
            setOwnImage(allImageList);
          }
        } else {
          console.warn(`User data not found for uid: ${userUid}`);
        }
      } catch (error) {
        console.error("Error fetching images:", error.message);
      }
    };

    getAllImages();
  }, [firestore, forceByUpdate]);

  // const deleteImage = async (imageId,imageUrl) => {
  //   console.log(imageId,imageUrl)
  //   try {
  //     const DocRef = doc(firestore, "image", imageId);
  //     const imageRef = ref(storage, imageUrl);
  //     await deleteObject(imageRef);
  //     await deleteDoc(DocRef);
  //     setForceByUpdate(!forceByUpdate);
  //     return DocRef.id;
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  // const updateImage = async (id, image, name, previmg) => {
  //   console.log(id)
  //   console.log(image)
  //   console.log(name)
  //   console.log(previmg)

  //   try {
  //     const campDocRef = doc(firestore, "image", id);

  //     const updateData = {};

  //     if (name) {
  //       updateData.name = name;
  //     }

  //     if (image) {
  //       const storageRef = ref( storage,`/images/${id}_${Date.now()}`);
  //       await uploadBytes(storageRef, image);
  //       const downloadURL = await getDownloadURL(storageRef);
  //       updateData.image = downloadURL;

  //       if (previmg) {
  //         try {
  //           const prevImageRef = ref(storage, previmg);
  //           await getMetadata(prevImageRef); // Check if the object exists
  //           await deleteObject(prevImageRef);
  //         } catch (error) {
  //           console.error("Error deleting previous image:", error.message);
  //         }
  //       }
  //     }

  //     await updateDoc(campDocRef, updateData);
  //     setForceByUpdate(!forceByUpdate)
  //     return campDocRef.id;
  //   } catch (error) {
  //     console.error("Error updating senior admin:", error.message);
  //   }
  // };

  // const LikeImage = async (id) => {
  //   const userUid = localStorage.getItem("UId");
  //   try {
  //     const imageDocRef = doc(firestore, "image", id);

  //     // Fetch the current document data
  //     const imageDocSnapshot = await getDoc(imageDocRef);
  //     const imageData = imageDocSnapshot.data();

  //     // Check if the user's UID is already in the likedBy array
  //     const likedByArray = imageData.likedBy || [];

  //     if (likedByArray.includes(userUid)) {
  //       // If user's UID is already in the array, remove it (unlike)
  //       const updatedLikedByArray = likedByArray.filter((uid) => uid !== userUid);
  //       await updateDoc(imageDocRef, { likedBy: updatedLikedByArray });
  //     } else {
  //       // If user's UID is not in the array, add it (like)
  //       const updatedLikedByArray = [...likedByArray, userUid];
  //       await updateDoc(imageDocRef, { likedBy: updatedLikedByArray });
  //     }

  //     // Trigger a re-render by updating forceByUpdate
  //     setForceByUpdate(!forceByUpdate);
  //   } catch (error) {
  //     console.error("Error updating like status:", error.message);
  //   }
  // };

  const deleteImage = async (imageId, imageUrl) => {
    console.log(imageId, imageUrl);
    try {
      const docRef = doc(firestore, "image", imageId);
      const imageRef = ref(storage, imageUrl);

      await deleteObject(imageRef);
      await deleteDoc(docRef);

      // Update the local state by removing the deleted image
      setAllImage((prevImages) =>
        prevImages.filter((img) => img.id !== imageId)
      );
      setOwnImage((prevImages) =>
        prevImages.filter((img) => img.id !== imageId)
      );

      setForceByUpdate(!forceByUpdate);

      return docRef.id;
    } catch (error) {
      console.log(error.message);
    }
  };

  const updateImage = async (id, image, name, previmg) => {
    console.log(id);
    console.log(image);
    console.log(name);
    console.log(previmg);

    try {
      const campDocRef = doc(firestore, "image", id);

      const updateData = {};

      if (name) {
        updateData.name = name;
      }

      if (image) {
        const storageRef = ref(storage, `/images/${id}_${Date.now()}`);
        await uploadBytes(storageRef, image);
        const downloadURL = await getDownloadURL(storageRef);
        updateData.image = downloadURL;

        if (previmg) {
          try {
            const prevImageRef = ref(storage, previmg);
            await getMetadata(prevImageRef); 
            await deleteObject(prevImageRef);
          } catch (error) {
            console.error("Error deleting previous image:", error.message);
          }
        }
      }

      await updateDoc(campDocRef, updateData);
      // setForceByUpdate(!forceByUpdate);

      // Update the local state for the specific image
      setAllImage((prevImages) =>
        prevImages.map((img) =>
          img.id === id ? { ...img, ...updateData } : img
        )
      );
      setOwnImage((prevImages) =>
        prevImages.map((img) =>
          img.id === id ? { ...img, ...updateData } : img
        )
      );

      setForceByUpdate(!forceByUpdate);

      return campDocRef.id;
    } catch (error) {
      console.error("Error updating senior admin:", error.message);
    }
  };

  // const LikeImage = async (id) => {
  //   const userUid = localStorage.getItem("UId");
  //   try {
  //     const imageDocRef = doc(firestore, "image", id);

  //     // Fetch the current document data
  //     const imageDocSnapshot = await getDoc(imageDocRef);
  //     const imageData = imageDocSnapshot.data();

  //     // Check if the user's UID is already in the likedBy array
  //     const likedByArray = imageData.likedBy || [];

  //     if (likedByArray.includes(userUid)) {
  //       // If user's UID is already in the array, remove it (unlike)
  //       const updatedLikedByArray = likedByArray.filter(
  //         (uid) => uid !== userUid
  //       );
  //       await updateDoc(imageDocRef, { likedBy: updatedLikedByArray });
  //       // Update the local state for the specific image
  //       setAllImage((prevImages) => {
  //         return prevImages.map((image) => {
  //           if (image.id === id) {
  //             return { ...image, likedBy: updatedLikedByArray };
  //           }
  //           return image;
  //         });
  //       });
  //       setOwnImage((prevImages) => {
  //         return prevImages.map((image) => {
  //           if (image.id === id) {
  //             return { ...image, likedBy: updatedLikedByArray };
  //           }
  //           return image;
  //         });
  //       });
  //     } else {
  //       // If user's UID is not in the array, add it (like)
  //       const updatedLikedByArray = [...likedByArray, userUid];
  //       await updateDoc(imageDocRef, { likedBy: updatedLikedByArray });
  //       // Update the local state for the specific image
  //       setAllImage((prevImages) => {
  //         return prevImages.map((image) => {
  //           if (image.id === id) {
  //             return { ...image, likedBy: updatedLikedByArray };
  //           }
  //           return image;
  //         });
  //       });
  //       setOwnImage((prevImages) => {
  //         return prevImages.map((image) => {
  //           if (image.id === id) {
  //             return { ...image, likedBy: updatedLikedByArray };
  //           }
  //           return image;
  //         });
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error updating like status:", error.message);
  //   }
  // };

  // const LikeImage = async (id, increment) => {
  //   const userUid = localStorage.getItem("UId");
  //   try {
  //     const imageDocRef = doc(firestore, "image", id);

  //     // Fetch the current document data
  //     const imageDocSnapshot = await getDoc(imageDocRef);
  //     const imageData = imageDocSnapshot.data();

  //     // Check if the user's UID is already in the likedBy array
  //     const likedByArray = imageData.likedBy || [];

  //     if (increment) {
  //       // Increment the like count
  //       const updatedLikedByArray = [...likedByArray, userUid];
  //       await updateDoc(imageDocRef, { likedBy: updatedLikedByArray });
  //     } else {
  //       // Decrement the like count
  //       const updatedLikedByArray = likedByArray.filter((uid) => uid !== userUid);
  //       await updateDoc(imageDocRef, { likedBy: updatedLikedByArray });
  //     }

  //     return imageDocRef.id;
  //   } catch (error) {
  //     console.error("Error updating like status:", error.message);
  //   }
  // };

  const LikeImage = async (id, increment) => {
    const userUid = localStorage.getItem("UId");
    try {
      const imageDocRef = doc(firestore, "image", id);

      // get current document data
      const imageDocSnapshot = await getDoc(imageDocRef);
      const imageData = imageDocSnapshot.data();

      // Check user uid is already in the likedBy array
      const likedByArray = imageData.likedBy || [];

      // Remove null values form likedByArray
      const cleanLikedByArray = likedByArray.filter((uid) => uid !== null);

      if (increment) {
        // Increment ike
        const updatedLikedByArray = [...cleanLikedByArray, userUid];
        await updateDoc(imageDocRef, { likedBy: updatedLikedByArray });
      } else {
        // Decrement like
        const updatedLikedByArray = cleanLikedByArray.filter(
          (uid) => uid !== userUid
        );
        await updateDoc(imageDocRef, { likedBy: updatedLikedByArray });
      }

      return imageDocRef.id;
    } catch (error) {
      console.error("Error updating like status:", error.message);
    }
  };

  const getUserInfoList = async (uidList) => {
    try {
      const userInfoList = [];

      for (const uid of uidList) {
        const userQuery = query(collection(firestore, "user"),where("uid", "==", uid));
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const userData = { id: userDoc.id, ...userDoc.data() };
          userInfoList.push(userData);
        } else {
          console.warn(`User data not found for uid: ${uid}`);
        }
      }
      console.log(userInfoList);
      return userInfoList;
    } catch (error) {
      console.error("Error fetching user info:", error.message);
      throw error; 
    }
  };

  const getUserInfoListWithLikedImages = async (uidList) => {
    try {
      const userInfoList = [];
  
      for (const uid of uidList) {
        const userQuery = query(collection(firestore, "user"), where("uid", "==", uid));
        const userSnapshot = await getDocs(userQuery);
  
        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const userData = { id: userDoc.id, ...userDoc.data() };
  
          userInfoList.push(userData);
        } else {
          console.warn(`User data not found for uid: ${uid}`);
        }
      }
  
      console.log(userInfoList);
      return userInfoList;
    } catch (error) {
      console.error("Error fetching user info:", error.message);
      throw error; 
    }
  };
  


  return (
    <CreateDataContext.Provider
      value={{
        createNewImage,
        uploadeImage,
        uploadeStope,
        setUoloadeStope,
        allImage,
        ownImage,
        deleteImage,
        forceByUpdate,
        setForceByUpdate,
        updateImage,
        LikeImage,
        getUserInfoList,
        getUserInfoListWithLikedImages
      }}
    >
      {children}
    </CreateDataContext.Provider>
  );
};
