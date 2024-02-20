import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./page/home/Home";
import Signin from "./page/signin/Signin";
import Navbar from "./components/Navbar/Navbar";
import { FirebaseAuthProvider } from "./context/AuthContext";
import Join from "./page/joinus/Join";
import Profile from "./page/profile/Profile";
import { CreateDataContextProvider } from "./context/CteateDataContext";
import Uploade from "./page/uploade/Uploade";
const App = () => {
  return (
    <>
      <BrowserRouter>
        <FirebaseAuthProvider>
          <CreateDataContextProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/join" element={<Join />} />
              <Route path="/uploade" element={<Uploade />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </CreateDataContextProvider>
        </FirebaseAuthProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
