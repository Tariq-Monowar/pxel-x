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
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { useAuthFirebase } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate()
  const firebase = useAuthFirebase();
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const sugnupDataSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await firebase.signupUserWithEmailAndPassword(
      userName,
      email,
      password
    );
    if (result) {
      console.log(result);
      setLoading(false);
      navigate("/profile")
    } else {
      if (result.error.includes("email-already-in-use")) {
        setError("email already use");
        console.log("Hello")
      }else{
        setError("! Try again");
      }
      setLoading(false);
    }
  };
  
  console.log(error);
  return (
    <>
      <p className="fromTitle">Signup</p>

      <form onSubmit={sugnupDataSubmit} style={{ textAlign: "center" }}>
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
            User Name
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
            type="text"
            autoComplete="off"
            required
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
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
            type="email"
            autoComplete="off"
            required
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

        {error && <p className="errorMeeage">{error}</p>}
      </form>
    </>
  );
};

export default Signup;
