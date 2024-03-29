import Navbar from "./components/Navbar";
import Products from "./pages/Products";
import LoginForm from "./components/LoginForm";
import Logout from "./pages/Logout";
import ProductView from "./pages/ProductView";
import Home from "./pages/Home";
import Register from "./pages/Register";
import PageNotFound from "./components/PageNotFound";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";

import { UserProvider } from "./UserContext";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [user, setUser] = useState({
    id: null,
    firstName: null,
    lastName: null,
  });
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/products/`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
      });
  }, []);

  const unsetUser = () => {
    localStorage.clear();
  };

  useEffect(() => {
    fetch(`${API_URL}/user/details`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result && typeof data.result.id !== undefined) {
          setUser({
            id: data.result.id,
            firstName: data.result.firstName,
            lastName: data.result.lastName,
          });
          // Removed console.log(user) here
        } else {
          setUser({
            id: null,
            firstName: null,
            lastName: null,
          });
        }
      });
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/cart/all`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    })
      .then((res) => res.json())
      .then((products) => {
        setCart(products);
      })
      .catch((error) => {});
  }, []);

  const [orders, setOrders] = useState([]);
  useEffect(() => {
    fetch(`${API_URL}/orders/my-orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.message);
      });
  }, []);

  return (
    <UserProvider
      value={{
        user,
        setUser,
        unsetUser,
        products,
        setProducts,
        cart,
        setCart,
        orders,
      }}
    >
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user/login" element={<LoginForm />} />
          <Route path="/user/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:productId" element={<ProductView />} />
          <Route path="/user/logout" element={<Logout />} />
          <Route path="/cart/all" element={<Cart />} />
          <Route path="/orders/my-orders/" element={<Order />} />
          <Route path="/about-us/" element={<AboutUs />} />
          <Route path="/contact/" element={<Contact />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
