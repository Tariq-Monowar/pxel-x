import React, { useEffect, useState } from "react";
import { useAuthFirebase } from "../../context/AuthContext";
import "./navbar.css";
import { NavLink, useLocation } from "react-router-dom";
import Avatar from "@mui/material/Avatar";

const Navbar = () => {
  const firebase = useAuthFirebase();
  const location = useLocation()
  
  const [userData, setUserData] = useState(null);
  const [parmitLogin, setParmitLogin] = useState(null);
  console.log(userData, parmitLogin);

  // Update user data in the Navbar component when it changes
  useEffect(() => {
    setParmitLogin(localStorage.getItem("userCollectionId"));
    setUserData(firebase.currentUserData);
  }, [firebase.currentUserData, firebase.updateProfileData]);
  console.log(userData);


  const [nabVarStyle, setnabVarStyle] = useState(true)

  // const ChangeBackground = ()=>{
  //   if(window.scrollY >= 240 && location.pathname === "/"){
  //     setnabVarStyle(true)
  //   }else{
  //     setnabVarStyle(false)
  //   }
  // }
  // window.addEventListener('scroll',ChangeBackground)
  // console.log(nabVarStyle)

 
  return (
    // <nav className={nabVarStyle? "navbarHome" : "navbar"} >
    <nav className="navbar">

      <div className="logo">
        <p>pxel x</p>
      </div>
      <div className="navelement">
        <NavLink to="/" className="s1telement element">
          images
        </NavLink>
        {(userData || parmitLogin) && (
          <NavLink to="/uploade" className="s2telement element">
            uploade
          </NavLink>
        )}
        {!userData && !parmitLogin && (
          <NavLink to="/join" className="element">
            join
          </NavLink>
        )}

        {(userData || parmitLogin) && (
          <NavLink to="/profile" className="element">
            {userData?.photoURL ? (
              <div className="isImage">
                <img className="userPhoto" src={userData.photoURL} alt="" />
              </div>
            ) : (
              // <Avatar alt="Remy Sharp" src={userData.photoURL} />
              <div className="isNotimage">
                <span>{userData?.displayName?.slice(0, 2)}</span>
              </div>
            )}
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
