import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserProvider } from './context/userContext.jsx';
import { Provider } from "react-redux";
import reduxStore from "./reduxStore";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
    <Provider store={reduxStore}>
    <App />
    </Provider>
    </UserProvider>
  </StrictMode>,
)
