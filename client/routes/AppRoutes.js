import { useRoutes } from 'react-router-dom';
import Login from '../src/pages/Login';
import Register from '../src/pages/Register';
import Dashboard from '../src/pages/Dashboard';

const AppRoutes = () => {
    const routes = [
        { path: '/', element: <Login /> },
        { path: '/login', element: <Login /> },
        { path: '/register', element: <Register /> },
        { path: '/dashboard', element: <Dashboard /> },
    ];

    return useRoutes(routes);
};

export default AppRoutes;
