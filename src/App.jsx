import React, { useEffect, useState } from "react";
import axios from "axios";
import AppRoutes from "./router";
import { BrowserRouter as Router } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css'
{/* <link
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
  rel="stylesheet"
  integrity="sha384-..."
  crossorigin="anonymous"
/> */}
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
const App = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("https://multi-vendor-marketplace-backend.onrender.com")
      .then(response => setMessage(response.data))
      .catch(error => console.error(error));
  }, []);


  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
