import { Navigate, Route, Routes } from 'react-router-dom';

import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import UsersPage from './pages/UsersPage';
import BlogsPage from './pages/BlogsPage';
import LoginPage from './pages/LoginPage';
import BlogDetailPage from './pages/BlogDetailPage';

function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function App() {
    return (
        <Layout>
            <Routes>

                <Route
                    path="/"
                    element={<HomePage />}
                />

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/blogs"
                    element={<BlogsPage />}
                />

                <Route
                    path="/blogs/:slug"
                    element={<BlogDetailPage />}
                />

                <Route
                    path="/users"
                    element={
                        <ProtectedRoute>
                            <UsersPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>
        </Layout>
    );
}

export default App;