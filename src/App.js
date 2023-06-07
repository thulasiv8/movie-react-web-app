import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router";
import Profile from "./pages/profile";
import Search from "./pages/search";
import Home from "./pages/home/index";
import Details from "./pages/details";
import Login from "./pages/login";

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile/*" element={<Profile />} />
          <Route path="/details" element={<Details />} />
          <Route path="/login" element={<Login />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
