import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="bg-blue-600 text-white p-3 flex gap-5">
      <Link to="/" className="hover:underline">Home</Link>
      <Link to="/categories" className="hover:underline">Categories</Link>
      <Link to="/products" className="hover:underline">Products</Link>
    </div>
  );
}
