import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import LevelSelect from './pages/LevelSelect';
import Playground from './pages/Playground';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/levels" element={<LevelSelect />} />
        <Route path="/playground/:levelId" element={<Playground />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
