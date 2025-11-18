import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { AppLayout } from './components/AppLayout';
import { ValuesOverviewPage } from './pages/ValuesOverviewPage';
import { ValueDetailPage } from './pages/ValueDetailPage';

function App() {
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
