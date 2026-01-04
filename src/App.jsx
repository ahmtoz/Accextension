import './index.css';
import Home from './pages/Home/Home.jsx';
import About from './pages/About/About.jsx';
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/about' element={<About />} />
    </Routes>
  )
}

export default App
