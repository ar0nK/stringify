import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PageSelector from './pages/PageSelector';
import GuitarBuilder from './pages/GuitarBuilder';
import Store from './pages/Store'
import Settings from './pages/Settings';
import Product from './pages/Product';
import SavedProducts from './pages/SavedProducts';
import Cart from './pages/Cart';
import LoginRegister from './pages/LoginRegister';
import Profile from './pages/Profile'


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PageSelector />} />
          <Route path="/guitar-builder" element={<GuitarBuilder />} />
          <Route path="/store" element={<Store />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/saved-products" element={<SavedProducts />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/profile" element={<Profile/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;