import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import CreateGoal from './pages/CreateGoal';
import GoalDetails from './pages/GoalDetails';
import EditGoal from './pages/EditGoal';
import NotFound from './pages/NotFound';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public Routes (only accessible if NOT logged in) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Routes (only accessible if logged in) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/goals/new" element={<CreateGoal />} />
          <Route path="/goals/:id" element={<GoalDetails />} />
          <Route path="/goals/:id/edit" element={<EditGoal />} />
        </Route>
      </Route>

      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
