import { useEffect, useState } from "react";
import { BrowserRouter, Router, useSearchParams } from "react-router-dom";
import Edit from "./pages/Edit";
import Tree from "./components/tree";

const App = () => {
    return (
        <>
            <BrowserRouter>
                <Edit />
            </BrowserRouter>
        </>
    );
};

export default App;
