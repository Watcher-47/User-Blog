import Panel from '../components/Panel';

function Stat({ label, value, detail }) {
    return (
        <div className="stat-card">
            <p className="stat-label">{label}</p>
            <p className="stat-value">{value}</p>
            <p className="stat-detail">{detail}</p>
        </div>
    );
}

export default function HomePage() {

    const savedUser = localStorage.getItem('user');

    let currentUser = null;

    try {
        currentUser = savedUser
            ? JSON.parse(savedUser)
            : null;
    } catch (error) {
        console.error('Invalid user data:', error);
    }

    return (
        <div className="home-grid">

            <Panel className="hero-panel">

                <div className="hero-content">

                    <span className="badge dark">
                        Overview
                    </span>

                    <h2 className="hero-title">
                        Blog Management System
                    </h2>

                    <p className="hero-text">
                        Manage users and blog posts through a
                        simple admin-style interface with
                        authentication and role-based access.
                    </p>

                    {currentUser && (
                        <div
                            className="stack-item"
                            style={{ marginTop: '1rem' }}
                        >
                            <strong>
                                Welcome, {currentUser.name}
                            </strong>

                            <br />

                            <span>
                                Roll Number: {currentUser.rollnum}
                            </span>

                            <br />

                            <span>
                                Role: {currentUser.role}
                            </span>
                        </div>
                    )}

                    <div className="stats-grid">

                        <Stat
                            label="Routes"
                            value="3"
                            detail="Home, Users, Blogs"
                        />

                        <Stat
                            label="Authentication"
                            value="JWT"
                            detail="Token-based login"
                        />

                        <Stat
                            label="Roles"
                            value="2"
                            detail="User and Admin"
                        />

                    </div>

                </div>

            </Panel>

            <Panel className="links-panel">

                <div>

                    <p className="eyebrow">
                        Navigation
                    </p>

                    <h3 className="card-title">
                        Quick links
                    </h3>

                    <p className="card-subtitle">
                        Manage users and blog posts from
                        the available sections.
                    </p>

                </div>

                <div className="stack-list">

                    <div className="stack-item">
                        Home page: application overview
                    </div>

                    <div className="stack-item">
                        Users page: users, passwords and roles
                    </div>

                    <div className="stack-item">
                        Blogs page: create, edit and delete blogs
                    </div>

                </div>

            </Panel>

        </div>
    );
}