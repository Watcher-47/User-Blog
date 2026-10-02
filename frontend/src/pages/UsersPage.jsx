import { useEffect, useState } from 'react';
import Panel from '../components/Panel';
import SectionHeader from '../components/SectionHeader';
import ShowcaseTable from '../components/ShowcaseTable';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editingUser, setEditingUser] = useState(null);

    const [createForm, setCreateForm] = useState({
        name: '',
        rollnum: '',
        password: '',
        role: 'user'
    });

    const [editForm, setEditForm] = useState({
        name: '',
        rollnum: '',
        role: 'user'
    });

    const [createErrors, setCreateErrors] = useState({});
    const [editErrors, setEditErrors] = useState({});
    const [createSubmitError, setCreateSubmitError] = useState('');
    const [editSubmitError, setEditSubmitError] = useState('');

    const token = localStorage.getItem('token');

    const getAllUsers = async () => {
        try {
            const response = await fetch(
                'http://localhost:3001/api/users'
            );

            const data = await response.json();

            setUsers(
                Array.isArray(data.data)
                    ? data.data
                    : []
            );
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const validateCreateUser = () => {
        const errors = {};

        if (!createForm.name.trim()) {
            errors.name = 'Full name is required';
        }

        if (String(createForm.rollnum).trim() === '') {
            errors.rollnum = 'Roll Number is required';
        } else if (Number.isNaN(Number(createForm.rollnum))) {
            errors.rollnum = 'Roll Number must be a number';
        }

        if (!createForm.password) {
            errors.password = 'Password is required';
        } else if (createForm.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (!['user', 'admin'].includes(createForm.role)) {
            errors.role = 'Role must be user or admin';
        }

        setCreateErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const createUser = async (e) => {
        e.preventDefault();

        if (!validateCreateUser()) {
            return;
        }

        try {
            setCreateSubmitError('');

            const response = await fetch(
                'http://localhost:3001/api/auth/register',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: createForm.name,
                        rollnum: Number(createForm.rollnum),
                        password: createForm.password,
                        role: createForm.role
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setCreateSubmitError(
                    data?.message || 'Failed to create user'
                );
                return;
            }

            setCreateForm({
                name: '',
                rollnum: '',
                password: '',
                role: 'user'
            });

            setCreateErrors({});

            await getAllUsers();

        } catch (error) {
            setCreateSubmitError(
                error.message || 'Error creating user'
            );
        }
    };

    const deleteUser = async (userId) => {
        try {
            const response = await fetch(
                `http://localhost:3001/api/users/${userId}`,
                {
                    method: 'DELETE',
                    headers: token
                        ? {
                            Authorization: `Bearer ${token}`
                        }
                        : {}
                }
            );

            if (response.ok) {
                await getAllUsers();
            } else {
                const data = await response.json().catch(() => ({}));

                console.error(
                    data?.message || 'Failed to delete user'
                );
            }

        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const startEditUser = (user) => {
        setEditingUser(user);

        setEditForm({
            name: user.name || '',
            rollnum: user.rollnum || '',
            role: user.role || 'user'
        });

        setEditErrors({});
        setEditSubmitError('');
    };

    const cancelEditUser = () => {
        setEditingUser(null);

        setEditForm({
            name: '',
            rollnum: '',
            role: 'user'
        });

        setEditErrors({});
        setEditSubmitError('');
    };

    const validateUserEdit = () => {
        const errors = {};

        if (!editForm.name.trim()) {
            errors.name = 'Full name is required';
        }

        if (String(editForm.rollnum).trim() === '') {
            errors.rollnum = 'Roll Number is required';
        } else if (Number.isNaN(Number(editForm.rollnum))) {
            errors.rollnum = 'Roll Number must be a number';
        }

        if (!['user', 'admin'].includes(editForm.role)) {
            errors.role = 'Role must be user or admin';
        }

        setEditErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const updateUser = async () => {
        if (!validateUserEdit()) {
            return;
        }

        try {
            setEditSubmitError('');

            if (!editingUser?._id) {
                return;
            }

            const response = await fetch(
                `http://localhost:3001/api/users/${editingUser._id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token
                            ? {
                                Authorization: `Bearer ${token}`
                            }
                            : {})
                    },
                    body: JSON.stringify({
                        name: editForm.name,
                        rollnum: Number(editForm.rollnum),
                        role: editForm.role
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setEditSubmitError(
                    data?.message || 'Failed to update user'
                );
                return;
            }

            cancelEditUser();
            await getAllUsers();

        } catch (error) {
            setEditSubmitError(
                error.message || 'Error updating user'
            );
        }
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    return (
        <div className="page-stack">

            <SectionHeader
                eyebrow="Users"
                title="Manage the team"
                description="Create users with passwords, manage roles, and update user accounts."
            />

            <div className="content-grid">

                <Panel>
                    <div className="card-header">
                        <div>
                            <h3 className="card-title">
                                Users table
                            </h3>

                            <p className="card-subtitle">
                                Current users and their roles.
                            </p>
                        </div>

                        <span className="badge success">
                            Active
                        </span>
                    </div>

                    <ShowcaseTable
                        columns={[
                            'Name',
                            'Roll Number',
                            'Role',
                            'Edit',
                            'Delete'
                        ]}
                        rows={users.map((user) => ({
                            _id: user._id,

                            cells: [

                                <button
                                    type="button"
                                    className="table-link"
                                    onClick={() =>
                                        setSelectedUser(user)
                                    }
                                >
                                    {user.name}
                                </button>,

                                user.rollnum,

                                user.role || 'user',

                                <button
                                    type="button"
                                    onClick={() =>
                                        startEditUser(user)
                                    }
                                    className="bg-amber-400 hover:bg-amber-500 text-white py-1 px-3 rounded"
                                >
                                    Edit
                                </button>,

                                <button
                                    type="button"
                                    onClick={() =>
                                        deleteUser(user._id)
                                    }
                                    className="bg-red-400 hover:bg-red-500 text-white py-1 px-3 rounded"
                                >
                                    Delete
                                </button>
                            ]
                        }))}
                    />
                </Panel>

                <Panel>

                    <div className="card-header">
                        <div>
                            <h3 className="card-title">
                                Create user
                            </h3>

                            <p className="card-subtitle">
                                Create an account with login credentials.
                            </p>
                        </div>
                    </div>

                    <form
                        className="form-grid"
                        onSubmit={createUser}
                    >

                        <label>
                            <span className="field-label">
                                Full name
                            </span>

                            <input
                                type="text"
                                className={`field-input ${
                                    createErrors.name
                                        ? 'field-input-error'
                                        : ''
                                }`}
                                placeholder="Enter full name"
                                value={createForm.name}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    setCreateForm({
                                        ...createForm,
                                        name: value
                                    });

                                    setCreateErrors((prev) => ({
                                        ...prev,
                                        name: value.trim()
                                            ? ''
                                            : 'Full name is required'
                                    }));
                                }}
                            />

                            {createErrors.name && (
                                <span className="field-error">
                                    {createErrors.name}
                                </span>
                            )}
                        </label>

                        <label>
                            <span className="field-label">
                                Roll Number
                            </span>

                            <input
                                type="number"
                                className={`field-input ${
                                    createErrors.rollnum
                                        ? 'field-input-error'
                                        : ''
                                }`}
                                placeholder="Enter roll number"
                                value={createForm.rollnum}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    setCreateForm({
                                        ...createForm,
                                        rollnum: value
                                    });

                                    setCreateErrors((prev) => ({
                                        ...prev,
                                        rollnum:
                                            value.trim() === ''
                                                ? 'Roll Number is required'
                                                : Number.isNaN(Number(value))
                                                    ? 'Roll Number must be a number'
                                                    : ''
                                    }));
                                }}
                            />

                            {createErrors.rollnum && (
                                <span className="field-error">
                                    {createErrors.rollnum}
                                </span>
                            )}
                        </label>

                        <label>
                            <span className="field-label">
                                Password
                            </span>

                            <input
                                type="password"
                                className={`field-input ${
                                    createErrors.password
                                        ? 'field-input-error'
                                        : ''
                                }`}
                                placeholder="Enter password"
                                value={createForm.password}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    setCreateForm({
                                        ...createForm,
                                        password: value
                                    });

                                    setCreateErrors((prev) => ({
                                        ...prev,
                                        password:
                                            !value
                                                ? 'Password is required'
                                                : value.length < 6
                                                    ? 'Password must be at least 6 characters'
                                                    : ''
                                    }));
                                }}
                            />

                            {createErrors.password && (
                                <span className="field-error">
                                    {createErrors.password}
                                </span>
                            )}
                        </label>

                        <label>
                            <span className="field-label">
                                Role
                            </span>

                            <select
                                className={`field-input ${
                                    createErrors.role
                                        ? 'field-input-error'
                                        : ''
                                }`}
                                value={createForm.role}
                                onChange={(e) => {
                                    setCreateForm({
                                        ...createForm,
                                        role: e.target.value
                                    });

                                    setCreateErrors((prev) => ({
                                        ...prev,
                                        role: ''
                                    }));
                                }}
                            >
                                <option value="user">
                                    User
                                </option>

                                <option value="admin">
                                    Admin
                                </option>
                            </select>

                            {createErrors.role && (
                                <span className="field-error">
                                    {createErrors.role}
                                </span>
                            )}
                        </label>

                        {createSubmitError && (
                            <p className="span-2 form-error">
                                {createSubmitError}
                            </p>
                        )}

                        <div className="span-2 modal-actions">
                            <button
                                type="submit"
                                className="button-primary"
                            >
                                Create user
                            </button>
                        </div>

                    </form>

                </Panel>

            </div>

            {editingUser && (
                <div
                    className="modal-backdrop"
                    onClick={cancelEditUser}
                >
                    <div
                        className="modal-card"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="card-header">
                            <div>
                                <h3 className="card-title">
                                    Edit user
                                </h3>

                                <p className="card-subtitle">
                                    Update selected user.
                                </p>
                            </div>

                            <span className="badge warning">
                                Editing
                            </span>
                        </div>

                        <form
                            className="form-grid"
                            onSubmit={(e) => e.preventDefault()}
                        >

                            <label>
                                <span className="field-label">
                                    Full name
                                </span>

                                <input
                                    type="text"
                                    className={`field-input ${
                                        editErrors.name
                                            ? 'field-input-error'
                                            : ''
                                    }`}
                                    value={editForm.name}
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        setEditForm({
                                            ...editForm,
                                            name: value
                                        });

                                        setEditErrors((prev) => ({
                                            ...prev,
                                            name: value.trim()
                                                ? ''
                                                : 'Full name is required'
                                        }));
                                    }}
                                />

                                {editErrors.name && (
                                    <span className="field-error">
                                        {editErrors.name}
                                    </span>
                                )}
                            </label>

                            <label>
                                <span className="field-label">
                                    Roll Number
                                </span>

                                <input
                                    type="number"
                                    className={`field-input ${
                                        editErrors.rollnum
                                            ? 'field-input-error'
                                            : ''
                                    }`}
                                    value={editForm.rollnum}
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        setEditForm({
                                            ...editForm,
                                            rollnum: value
                                        });

                                        setEditErrors((prev) => ({
                                            ...prev,
                                            rollnum:
                                                value.trim() === ''
                                                    ? 'Roll Number is required'
                                                    : Number.isNaN(Number(value))
                                                        ? 'Roll Number must be a number'
                                                        : ''
                                        }));
                                    }}
                                />

                                {editErrors.rollnum && (
                                    <span className="field-error">
                                        {editErrors.rollnum}
                                    </span>
                                )}
                            </label>

                            <label>
                                <span className="field-label">
                                    Role
                                </span>

                                <select
                                    className={`field-input ${
                                        editErrors.role
                                            ? 'field-input-error'
                                            : ''
                                    }`}
                                    value={editForm.role}
                                    onChange={(e) => {
                                        setEditForm({
                                            ...editForm,
                                            role: e.target.value
                                        });

                                        setEditErrors((prev) => ({
                                            ...prev,
                                            role: ''
                                        }));
                                    }}
                                >
                                    <option value="user">
                                        User
                                    </option>

                                    <option value="admin">
                                        Admin
                                    </option>
                                </select>

                                {editErrors.role && (
                                    <span className="field-error">
                                        {editErrors.role}
                                    </span>
                                )}
                            </label>

                            {editSubmitError && (
                                <p className="span-2 form-error">
                                    {editSubmitError}
                                </p>
                            )}

                            <div className="span-2 modal-actions">

                                <button
                                    type="button"
                                    className="button-primary"
                                    onClick={updateUser}
                                >
                                    Update user
                                </button>

                                <button
                                    type="button"
                                    className="button-primary"
                                    onClick={cancelEditUser}
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>
                    </div>
                </div>
            )}

            {selectedUser && (
                <div
                    className="modal-backdrop"
                    onClick={() => setSelectedUser(null)}
                >
                    <div
                        className="modal-card"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="card-header">
                            <div>
                                <h3 className="card-title">
                                    User details
                                </h3>

                                <p className="card-subtitle">
                                    Selected user information.
                                </p>
                            </div>

                            <span className="badge">
                                Details
                            </span>
                        </div>

                        <div
                            className="detail-grid"
                            style={{ marginTop: '1rem' }}
                        >
                            <p>
                                <strong>Name:</strong>{' '}
                                {selectedUser.name}
                            </p>

                            <p>
                                <strong>Roll Number:</strong>{' '}
                                {selectedUser.rollnum}
                            </p>

                            <p>
                                <strong>Role:</strong>{' '}
                                {selectedUser.role || 'user'}
                            </p>

                            <p>
                                <strong>User ID:</strong>{' '}
                                {selectedUser._id}
                            </p>
                        </div>

                        <div
                            className="modal-actions"
                            style={{ marginTop: '1rem' }}
                        >
                            <button
                                type="button"
                                className="button-primary"
                                onClick={() => setSelectedUser(null)}
                            >
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}