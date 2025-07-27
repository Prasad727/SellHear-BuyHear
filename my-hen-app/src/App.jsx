import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Punju from './pages/Punju';
import Product_Info from './pages/Product_Info';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Goat from './pages/Goat';
import Login from './pages/Login';
import Buffalo from './pages/Buffalo';
import Profile from './pages/Profile';
import Verifyotp from './pages/Verifyotp';
import Sellerid from './components/Sellerid';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/punju" element={<Navigate to="/punjus" replace />} />
        <Route path="/punjus" element={<Punju />} />
        <Route path="/productinfo/:type/:id" element={<Product_Info />} />
        <Route path="/login" element={<Login />} />
        <Route path="/goat" element={<Goat />} />
        <Route path="/buffalo" element={<Buffalo />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/verify" element={<Verifyotp />} />
        <Route path="/seller" element={<Sellerid />} />
        <Route path="/punju/:id" element={<Product_Info />} />
        <Route path="/goat/:id" element={<Product_Info />} />
        <Route path="/buffalo/:id" element={<Product_Info />} />

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;