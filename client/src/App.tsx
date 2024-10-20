import { useEffect, useState } from "react";
import { BrowserRouter, Router, useSearchParams } from "react-router-dom";
import Edit from "./pages/Edit";
import Tree from "./components/tree";
import Login from "./pages/Login";
import Create from "./pages/Create";

const App = () => {
  return (
    <>
      <BrowserRouter>
        {/* <Edit /> */}
        {/* <Login /> */}
        <Create />
      </BrowserRouter>
    </>
  );
};

export default App;
