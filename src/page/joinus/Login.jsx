import "./join.css";
import React, { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import {
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";

import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import { useAuthFirebase } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const firebase = useAuthFirebase();
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading , setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const loginUserEithEmailPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const result = await firebase.signInUserWithEmailPassword(
        email,
        password
      );
      console.log(result);
      if (result.success) {
        setLoading(false);
        navigate("/profile")
        setError(null);
      } else {
        setLoading(false);
        setError(result.error);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const signWithGoogle = async()=>{
    try {
      let res = await firebase.signInWithGoogle()
      if(res.uid){
        navigate("/profile")
      }
      // navigate("/profile")
      console.log(res)
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
    }
  }

  const signInWithFacebook =async()=>{
    await firebase.signInWithFacebook()
  }

  const signWithGitHub = async()=>{
    await firebase.signInWithGitHub()
  }
  return (
    <>
      <p className="fromTitle">Login</p>

      <form
        onSubmit={loginUserEithEmailPassword}
        style={{ textAlign: "center" }}
      >
        <FormControl
          sx={{
            m: 1,
            color: "#fff",
            "&.Mui-focused": {
              color: "#f1fffa",
              border: "#f1fffa",
            },
            width: "250px",
          }}
          variant="standard"
        >
          <InputLabel
            sx={{
              color: "#f1fffa",
              "&.Mui-focused": {
                color: "#fff",
              },
            }}
            htmlFor="standard-adornment-password"
            id="inputLabelId"
          >
            Email
          </InputLabel>
          <Input
            sx={{
              color: "#fff",
              "&:hover": {
                "&:before": {
                  borderBottom: "2px solid #f0fef9f0",
                },
              },
              "&.Mui-focused": {
                color: "#f1fffa",
                "&:after": {
                  borderBottom: "2px solid #f0fef9f0",
                },
              },
              "&:after": {
                borderBottom: "2px solid #ffffffdb",
              },
              "&:before": {
                borderBottom: "2px solid #f0fef9f0",
              },
            }}
            id="standard-adornment-password"

            autoComplete="off"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl
          sx={{
            m: 1,
            color: "#fff",
            "&.Mui-focused": {
              color: "#f1fffa",
              border: "#f1fffa",
            },
          }}
          variant="standard"
        >
          <InputLabel
            sx={{
              color: "#f1fffa",
              "&.Mui-focused": {
                color: "#fff",
              },
            }}
            htmlFor="standard-adornment-password"
            id="inputLabelId"
          >
            Password
          </InputLabel>
          <Input
            sx={{
              color: "#fff",
              "&:hover": {
                "&:before": {
                  borderBottom: "2px solid #f0fef9f0",
                }, // Hover color
              },
              // borderColor: "#fff",
              "&.Mui-focused": {
                color: "#f1fffa",
                "&:after": {
                  borderBottom: "2px solid #f0fef9f0",
                },
              },
              "&:after": {
                borderBottom: "2px solid #ffffffdb",
              },
              "&:before": {
                borderBottom: "2px solid #f0fef9f0",
              },
            }}
            id="standard-adornment-password"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  style={{ color: "#f1fffa" }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <Button
          type="submit"
          id="submitBtn"
          sx={{
            textTransform: "none",
            borderRadius: "10px",
            background: "#203f35",
            width: "260px",
            marginTop: "25px",
            paddingTop: "4px",
            paddingBottom: "4px",
            fontSize: "17px",
            "&:hover": {
              background: "#1a342b",
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
        {error && <p className="errorMeeageLogin">invalid email or password</p>}
      </form>
            
      <p className="or">Or</p>

      <div className="otherLogin">
        <FaGoogle onClick={signWithGoogle} className="oricon" />
        <FaFacebookF onClick={signInWithFacebook} className="oricon" />
        <FaGithub onClick={signWithGitHub} className="oricon" />
      </div>
    </>
  );
};

export default Login;
