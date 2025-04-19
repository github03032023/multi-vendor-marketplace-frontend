import React, { useEffect, useState } from "react";
import axios from "axios";
import AppRoutes from "./router";
import {BrowserRouter as Router} from "react-router-dom";

const App = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("https://multi-vendor-marketplace-backend.onrender.com")
      .then(response => setMessage(response.data))
      .catch(error => console.error(error));
  }, []);


  return(
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
