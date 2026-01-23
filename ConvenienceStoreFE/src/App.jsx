import { useState } from "react";
import Header from "./constants/Header";
import "./index.css";
import Home from "./pages/Home";

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Home />
      </main>
    </div>
  );
}

export default App;
