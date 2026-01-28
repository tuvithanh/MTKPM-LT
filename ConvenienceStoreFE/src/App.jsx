import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./constants/Header";
import "./index.css";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Navbar />

        <main className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<CategoryPage />} />
            <Route path="/products" element={<ProductPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
