import { Routes, Route, Navigate} from 'react-router-dom';
import Login from '../src/pages/Login';
import Register from '../src/pages/Register';
import Dashboard from '../src/pages/Dashboard';
import ProtectedRoute from '../src/components/ProtectedRoute';
import Profile from '../src/pages/Profile';
import {isAuthenticated} from "../src/utils/auth";
import CGPACalculator from "../src/pages/CGPACalculator";

const AppRoutes = () => (
    <Routes>
        <Route
            path="/"
            element={
                isAuthenticated() ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
            }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
            path="/dashboard"
            element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            }
        />
        <Route
            path="/profile"
            element={
                <ProtectedRoute>
                    <Profile />
                </ProtectedRoute>
            }
        />

        <Route
            path="/cgpacalculator"
            element={
                <ProtectedRoute>
                    <CGPACalculator />
                </ProtectedRoute>
            }
        />
    </Routes>
);

export default AppRoutes;
