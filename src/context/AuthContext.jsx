import { createContext, useContext, useEffect, useState } from "react";
import { firebaseApp } from "./config";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  updateEmail,
  updatePassword,
  deleteUser,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
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
  where
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";


const FirebaseAuthContext = createContext(null);

const firebaseAuth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);
const firestore = getFirestore(firebaseApp);

export const useAuthFirebase = () => useContext(FirebaseAuthContext);

export const FirebaseAuthProvider = ({ children }) => {
  const currentAuth = getAuth();
  // console.log(currentAuth)

  const [forceUpdate, setForceUpdate] = useState(false);
  const [currentUserData, setCurrentUserData] = useState(null);

  useEffect(() => {
    // console.log("Auth state changed");
    onAuthStateChanged(firebaseAuth, (user) => {
      // console.log("User:", user);
      if (user) {
        setCurrentUserData(user);
        localStorage.setItem("UId", user.uid);
      } else {
        console.log("No user");
      }
    });
  }, [firebaseAuth, forceUpdate]);
  console.log(currentUserData);

  const sendVerificationEmail = async (user) => {
    try {
      await sendEmailVerification(user);
      console.log("Verification email sent");
    } catch (error) {
      console.error(error.message);
    }
  };

  const signupUserWithEmailAndPassword = async (userName, email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      const user = result.user;

      await updateProfile(user, {
        displayName: userName,
      });

      await sendVerificationEmail(user);

      const docRef = await addDoc(collection(firestore, "user"), {
        displayName: userName,
        email,
        uid: user.uid,
      });
      console.log(docRef.id);
      localStorage.setItem("userCollectionId", docRef.id);
      setForceUpdate(!forceUpdate)
      return { success: true, user };
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  };

 const signInUserWithEmailPassword = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );
    setForceUpdate(!forceUpdate);
    const user = result.user;

    if (user) {
      const { displayName, email, uid, photoURL } = user;
      // Check if user already exists in the database
      const querySnapshot = await getDocs(
        query(collection(firestore, "user"), where("uid", "==", uid))
      );

      if (querySnapshot.size === 0) {
        // User does not exist, add a new entry
        const docRef = await addDoc(collection(firestore, "user"), {
          displayName,
          email,
          uid,
          photoURL: photoURL ? photoURL : "",
        });
        setForceUpdate(!forceUpdate);
        console.log("Document written with ID:", docRef.id);
        localStorage.setItem("userCollectionId", docRef.id);
      } else {
        // User already exists, do not add a new entry
        console.log("User already exists in the database.", querySnapshot);
        querySnapshot.forEach((doc) => {
          const existingUserData = doc.data();
          console.log("Existing user data:", existingUserData);
          // Use the data as needed
          localStorage.setItem("userCollectionId", doc.id);
        });
      }

      return { success: true, user };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};


  // const signInWithGoogle = async () => {
  //   const provider = new GoogleAuthProvider();
  //   try {
  //     const result = await signInWithPopup(firebaseAuth, provider);
  //     const user = result.user;

  //     if (user) {
  //       const { displayName, email, uid, photoURL } = user; // Extract user information

  //       const docRef = await addDoc(collection(firestore, "user"), {
  //         displayName,
  //         email,
  //         uid,
  //         photoURL: photoURL ? photoURL : "",
  //       });

  //       console.log("Document written with ID:", docRef.id);
  //       localStorage.setItem("userCollectionId", docRef.id);
  //     }

  //     console.log("User signed in with Google:", user);
  //   } catch (error) {
  //     console.error("Error signing in with Google:", error.message);
  //   }
  // };


  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(firebaseAuth, provider);
      const user = result.user;
     
      if (user) {
        
        const { displayName, email, uid, photoURL } = user;
        // Check if user already exists in the database
        const querySnapshot = await getDocs(query(collection(firestore, "user"), where("uid", "==", uid)));
        
        if (querySnapshot.size === 0) {
          // User does not exist, add new entry
          const docRef = await addDoc(collection(firestore, "user"), {
            displayName,
            email,
            uid,
            photoURL: photoURL ? photoURL : "",
          });
          setForceUpdate(!forceUpdate)
          console.log("Document written with ID:", docRef.id);
          localStorage.setItem("userCollectionId", docRef.id);
        } else {
          // User already exists, do not add a new entry
          console.log("User already exists in the database.", querySnapshot);
          querySnapshot.forEach((doc) => {
            const existingUserData = doc.data();
            console.log("Existing user data:", existingUserData);
            // Use the data as needed
            localStorage.setItem("userCollectionId", doc.id);
          });
        }
      }
      return user
      // console.log("User signed in with Google:", );
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
    }
  };

  const signInWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(firebaseAuth, provider);
      const user = result.user;
      console.log("User signed in with Facebook:", user);
      return { success: true, user };
    } catch (error) {
      console.error("Error signing in with Facebook:", error.message);
      return { success: false, error: error.message };
    }
  };

  // const signInWithGitHub = async () => {
  //   const provider = new GithubAuthProvider();
  //   try {
  //     const result = await signInWithPopup(firebaseAuth, provider);
  //     const user = result.user;
  //     console.log("User signed in with GitHub:", user);
  //     return { success: true, user };
  //   } catch (error) {
  //     console.error("Error signing in with GitHub:", error.message);
  //     return { success: false, error: error.message };
  //   }
  // };

  const signInWithGitHub = async () => {
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(firebaseAuth, provider);
      const user = result.user;
  
      if (user) {
        // Check if user already exists in the database
        const querySnapshot = await getDocs(query(collection(firestore, "user"), where("uid", "==", user.uid)));
  
        if (querySnapshot.size === 0) {
          // User does not exist, add new entry
          const docRef = await addDoc(collection(firestore, "user"), {
            displayName: user.displayName,
            email: user.email,
            uid: user.uid,
            photoURL: user.photoURL ? user.photoURL : "",
          });
          console.log("Document written with ID:", docRef.id);
          localStorage.setItem("userCollectionId", docRef.id);
        } else {
          // User already exists, do not add a new entry
          console.log("User already exists in the database.", querySnapshot);
          querySnapshot.forEach((doc) => {
            const existingUserData = doc.data();
            console.log("Existing user data:", existingUserData);
            // Use the data as needed
            localStorage.setItem("userCollectionId", doc.id);
          });
        }
  
        console.log("User signed in with GitHub:", user);
        return { success: true, user };
      }
  
    } catch (error) {
      console.error("Error signing in with GitHub:", error.message);
      return { success: false, error: error.message };
    }
  };

  
  const updateProfileData = async (userName, image, prevUrl, uid) => {
    const userCollectionId = localStorage.getItem("userCollectionId");
  
    const updateDocRef = doc(firestore, "user", userCollectionId);
  
    const user = firebaseAuth.currentUser;
  
    const updateData = {};
  
    try {
      if (userName) {
        await updateProfile(user, {
          displayName: userName,
        });
        updateData.displayName = userName;
      }
  
      if (image) {
        const date = new Date().getTime();
        const storageRef = ref(storage, `/users/${uid}_${date}`);
        await uploadBytesResumable(storageRef, image);
        const downloadURL = await getDownloadURL(storageRef);
  
        updateData.photoURL = downloadURL;
  
        await updateProfile(user, { photoURL: downloadURL });
  
        if (prevUrl) {
          const photoRef = ref(storage, prevUrl);
          await deleteObject(photoRef);
        }
      }
  
      await updateDoc(updateDocRef, updateData);
  
      setForceUpdate(!forceUpdate);
  
      return { success: true, user, firebaseAuth };
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  };
  

  // const logout = async () => {
  //   const userCollectionId = localStorage.getItem("userCollectionId");
  //   try {
  //     if(currentUserData.providerData[0].providerId === "google.com"){
  //       const DocRef = doc(firestore, "user", userCollectionId);

  //       const docSnapshot = await getDoc(DocRef);
  //       if(docSnapshot?.data() && docSnapshot?.data().photoURL.slice(0, 33) !== "https://lh3.googleusercontent.com"){
  //         const imageRef = ref(storage, docSnapshot?.data().photoURL);
  //         await deleteObject(imageRef);
  //       }
  //       if(DocRef){
  //        await deleteDoc(DocRef);
  //       }

  //     }
  //     await firebaseAuth.signOut();
  //     setCurrentUserData(null);
  //   } catch (error) {
  //     console.error("Error logging out:", error.message);
      
  //   }
  // };

  const logout = async () => {
    // const userCollectionId = localStorage.getItem("userCollectionId");
    try {
      await firebaseAuth.signOut();
      localStorage.clear();
      setCurrentUserData(null);
    } catch (error) {
      console.error("Error logging out:", error.message);
      
    }
  };
  
  console.log(currentUserData);

  return (
    <FirebaseAuthContext.Provider
      value={{
        signupUserWithEmailAndPassword,
        signInUserWithEmailPassword,
        signInWithGoogle,
        signInWithFacebook,
        signInWithGitHub,
        currentUserData,
        setCurrentUserData,
        updateProfileData,
        logout,
      }}
    >
      {children}
    </FirebaseAuthContext.Provider>
  );
};
