import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserProvider } from './context/userContext.jsx';
import { Provider } from "react-redux";
import reduxStore from "./reduxStore";
// import { ChakraProvider } from '@chakra-ui/react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <ChakraProvider> */}
      <UserProvider>
        <Provider store={reduxStore}>
          <App />
        </Provider>
      </UserProvider>
    {/* </ChakraProvider> */}
  </StrictMode>,
)
