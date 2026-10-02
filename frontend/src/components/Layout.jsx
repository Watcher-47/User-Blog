import { Link, useLocation, useNavigate } from 'react-router-dom';

function Layout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();

    const token = localStorage.getItem('token');

    let user = null;

    try {
        user = JSON.parse(localStorage.getItem('user'));
    } catch {
        user = null;
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const isLoginPage = location.pathname === '/login';

    return (
        <div>
            <nav className="navbar">

                <div>
                    {!isLoginPage && (
                        <>
                            <Link to="/">Home</Link>

                            {' | '}

                            <Link to="/blogs">Blogs</Link>

                            {token && (
                                <>
                                    {' | '}

                                    <Link to="/users">
                                        Users
                                    </Link>
                                </>
                            )}
                        </>
                    )}
                </div>

                <div>
                    {token ? (
                        <>
                            <span>
                                {user?.name || 'User'}
                            </span>

                            {' '}

                            <button onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        !isLoginPage && (
                            <Link to="/login">
                                Login
                            </Link>
                        )
                    )}
                </div>

            </nav>

            <main>
                {children}
            </main>
        </div>
    );
}

export default Layout;