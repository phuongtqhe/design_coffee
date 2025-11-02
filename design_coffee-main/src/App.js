import React from "react";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { AppRouter } from "./routes/router";
function App() {
  return (
    <>
      <ToastContainer theme="colored" position="top-center"></ToastContainer>
      <AppRouter />
    </>
  );
}

export default App;
