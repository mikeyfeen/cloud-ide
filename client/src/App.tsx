import { useEffect, useState } from "react";
import { BrowserRouter, Router, useSearchParams } from "react-router-dom";
import Edit from "./pages/Edit";

const App = () => {
    return (
        <>
            <h1>REPL</h1>
            <BrowserRouter>
                <Edit />
            </BrowserRouter>
        </>
    );
};

export default App;
