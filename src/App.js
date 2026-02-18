import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import PageSelector from './pages/PageSelector';
import GuitarBuilder from './pages/GuitarBuilder';
import Store from './pages/Store';
import Settings from './pages/Settings';
import Product from './pages/Product';
import SavedProducts from './pages/SavedProducts';
import Cart from './pages/Cart';
import LoginRegister from './pages/LoginRegister';
import Profile from './pages/Profile';
import Delivery from './pages/Delivery';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PageSelector />} />
            <Route path="/store" element={<Store />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/product_info/:id" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<LoginRegister />} />
            <Route path="/profile" element={<Profile />} />

            <Route
              path="/delivery" element={
                <ProtectedRoute>
                  <Delivery />
                </ProtectedRoute>
              }
            />

            <Route
              path="/guitar-builder" element={
                <ProtectedRoute>
                  <GuitarBuilder />
                </ProtectedRoute>
              }
            />

            <Route
              path="/saved-products" element={
                <ProtectedRoute>
                  <SavedProducts />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;