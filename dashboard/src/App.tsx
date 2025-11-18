import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { AppLayout } from './components/AppLayout';
import { ValuesOverviewPage } from './pages/ValuesOverviewPage';
import { ValueDetailPage } from './pages/ValueDetailPage';
import { Login } from './components/Login';

const CORRECT_PASSWORD = 'rainbow'; // In production, use proper authentication

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = sessionStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (password: string) => {
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('isAuthenticated', 'true');
    } else {
      alert('Incorrect password. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <DataProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<ValuesOverviewPage />} />
            <Route path="/value/:valueId" element={<ValueDetailPage />} />
          </Routes>
        </AppLayout>
      </DataProvider>
    </BrowserRouter>
  );
}

export default App;
