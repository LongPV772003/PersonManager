import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import Home from './pages/Home';
import EmployeePage from './pages/EmployeePage';
import PendingApprovalPage from './pages/PendingApprovalPage';
import PrivateRoute from './component/privateRoute/PrivateRoute';
import MainLayout from './pages/MainLayout';
import EmployeeManager from './pages/EmployeeManager';
import EndedEmployees from './pages/EndedEmployees';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="employees" element={<EmployeePage />} />
          <Route path="penddingApproval" element={<PendingApprovalPage />} />
          <Route path="employeeManager" element={<EmployeeManager />} />
          <Route path="endedEmployees" element={<EndedEmployees />} />
        </Route>
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
