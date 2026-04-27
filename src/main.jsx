// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css' this one is commented. if you want to uncomment this part 
// don't forget to comment this line.

// import App from './App.jsx'

// import { BrowserRouter } from "react-router-dom"

// import "./i18n"

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </StrictMode>,
// )













import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProviderCustom } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { GoalsProvider } from "./context/GoalContext";
// import { GoalContext } from './context/GoalContext';
import { LocaleProvider } from './context/LocaleContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LocaleProvider>
      <ThemeProviderCustom>
        <AuthProvider>
          <GoalsProvider> 
          {/* <GoalContext> */}
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </GoalsProvider> 
          {/* </GoalContext> */}
        </AuthProvider>
      </ThemeProviderCustom>
    </LocaleProvider>
  </React.StrictMode>
);
