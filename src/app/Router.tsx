import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import HomePage from './pages/HomePage';
import TeamPage from './pages/TeamPage';
import WaitlistPage from './pages/WaitlistPage';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<HomePage />} />
        <Route path="/team"     element={<TeamPage />} />
        <Route path="/waitlist" element={<WaitlistPage />} />
        <Route path="*"         element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
