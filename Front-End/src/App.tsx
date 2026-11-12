import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { useApp } from './context/AppContext';
import Briefs from './pages/Briefs';
import Home from './pages/Home';
import Settings from './pages/Settings';

function HomeRoute() {
  const { resetKey } = useApp();
  return <Home key={resetKey} />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomeRoute />} />
        <Route path="briefs" element={<Briefs />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<HomeRoute />} />
      </Route>
    </Routes>
  );
}
