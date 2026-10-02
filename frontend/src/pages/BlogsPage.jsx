import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:3001/api';

const emptyForm = {
    title: '',
    desc: '',
    content: '',
    image: '',
    rating: 1
};

function BlogsPage() {
    const [blogs, setBlogs] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('token');

    let currentUser = null;

    try {
        currentUser = JSON.parse(localStorage.getItem('user'));
    } catch {
        currentUser = null;
    }

    const isAdmin = currentUser?.role === 'admin';

    const getHeaders = () => {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        return headers;
    };

    const fetchBlogs = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                API_URL + '/blogs'
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || 'Failed to fetch blogs'
                );
            }

            setBlogs(data.data || []);
        } catch (error) {
            console.error(error);
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAdmin) {
            setMessage('Admin access required');
            return;
        }

        setMessage('');

        const title = form.title.trim();
        const desc = form.desc.trim();
        const content = form.content.trim();
        const image = form.image.trim();
        const rating = Number(form.rating);

        if (title.length < 3 || title.length > 200) {
            setMessage(
                'Title must be between 3 and 200 characters.'
            );
            return;
        }

        if (desc.length < 10 || desc.length > 500) {
            setMessage(
                'Description must be between 10 and 500 characters.'
            );
            return;
        }

        if (content.length < 20) {
            setMessage(
                'Content must be at least 20 characters.'
            );
            return;
        }

        try {
            new URL(image);
        } catch {
            setMessage(
                'Image must be a valid URL, for example https://example.com/image.jpg'
            );
            return;
        }

        if (rating < 1 || rating > 5) {
            setMessage(
                'Rating must be between 1 and 5.'
            );
            return;
        }

        const payload = {
            title,
            desc,
            content,
            image,
            rating
        };

        try {
            const url = editingId
                ? API_URL + '/blogs/' + editingId
                : API_URL + '/blogs';

            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: getHeaders(),
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors?.length) {
                    setMessage(
                        data.errors
                            .map((error) => error.msg)
                            .join(' | ')
                    );
                } else {
                    setMessage(
                        data.message || 'Operation failed'
                    );
                }

                return;
            }

            setMessage(
                editingId
                    ? 'Blog updated successfully'
                    : 'Blog created successfully'
            );

            resetForm();
            fetchBlogs();
        } catch (error) {
            console.error(error);
            setMessage('Unable to connect to server');
        }
    };

    const handleEdit = (item) => {
        setEditingId(item._id);

        setForm({
            title: item.title || '',
            desc: item.desc || '',
            content: item.content || '',
            image: item.image || '',
            rating: item.rating || 1
        });

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleDelete = async (id) => {
        if (!isAdmin) {
            setMessage('Admin access required');
            return;
        }

        const confirmed = window.confirm(
            'Are you sure you want to delete this blog?'
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                API_URL + '/blogs/' + id,
                {
                    method: 'DELETE',
                    headers: getHeaders()
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message || 'Delete failed'
                );
                return;
            }

            setMessage('Blog deleted successfully');

            fetchBlogs();
        } catch (error) {
            console.error(error);
            setMessage('Unable to connect to server');
        }
    };

    return (
        <>
            <style>
                {`
                    .blogs-page {
                        min-height: calc(100vh - 70px);
                        background: #f5f7fb;
                        padding: 40px 25px 60px;
                    }

                    .blogs-container {
                        max-width: 1200px;
                        margin: 0 auto;
                    }

                    .blogs-title {
                        text-align: center;
                        margin: 0 0 35px;
                        font-size: 38px;
                        color: #1f2937;
                    }

                    .form-section {
                        background: white;
                        max-width: 800px;
                        margin: 0 auto 40px;
                        padding: 30px;
                        border-radius: 12px;
                        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
                    }

                    .form-section h2 {
                        margin-top: 0;
                        margin-bottom: 10px;
                        color: #1f2937;
                    }

                    .validation-info {
                        background: #f0f6ff;
                        border-left: 4px solid #2563eb;
                        padding: 15px 18px;
                        margin-bottom: 25px;
                        border-radius: 6px;
                    }

                    .validation-info strong {
                        color: #1f2937;
                    }

                    .validation-info ul {
                        margin: 10px 0 0;
                        padding-left: 20px;
                        color: #4b5563;
                        line-height: 1.7;
                    }

                    .form-section form {
                        display: flex;
                        flex-direction: column;
                        gap: 15px;
                    }

                    .field-label {
                        font-size: 14px;
                        font-weight: 600;
                        color: #374151;
                        margin-bottom: -8px;
                    }

                    .form-section input,
                    .form-section textarea {
                        width: 100%;
                        padding: 12px 14px;
                        border: 1px solid #d1d5db;
                        border-radius: 7px;
                        font-size: 15px;
                        box-sizing: border-box;
                        font-family: inherit;
                    }

                    .form-section textarea {
                        resize: vertical;
                    }

                    .form-section input:focus,
                    .form-section textarea:focus {
                        outline: none;
                        border-color: #2563eb;
                    }

                    .form-section button,
                    .blog-card button {
                        border: none;
                        padding: 10px 16px;
                        border-radius: 7px;
                        background: #2563eb;
                        color: white;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 600;
                    }

                    .form-section button:hover,
                    .blog-card button:hover {
                        opacity: 0.9;
                    }

                    .form-section button[type="button"] {
                        background: #6b7280;
                    }

                    .blog-message {
                        max-width: 800px;
                        margin: 0 auto 25px;
                        padding: 12px 16px;
                        background: white;
                        border-radius: 8px;
                        text-align: center;
                        color: #374151;
                    }

                    .loading-message,
                    .empty-message {
                        text-align: center;
                        color: #6b7280;
                        font-size: 16px;
                    }

                    .blog-list {
                        max-width: 1200px;
                        margin: 0 auto;
                        display: grid;
                        grid-template-columns: repeat(
                            auto-fit,
                            minmax(280px, 1fr)
                        );
                        gap: 25px;
                    }

                    .blog-card {
                        background: white;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 5px 18px rgba(0, 0, 0, 0.08);
                        padding-bottom: 20px;
                        transition: transform 0.2s ease;
                    }

                    .blog-card:hover {
                        transform: translateY(-4px);
                    }

                    .blog-card img {
                        width: 100%;
                        height: 200px;
                        object-fit: cover;
                        display: block;
                    }

                    .blog-card h2,
                    .blog-card p,
                    .blog-card a,
                    .blog-card > div {
                        margin-left: 20px;
                        margin-right: 20px;
                    }

                    .blog-card h2 {
                        margin-top: 20px;
                        margin-bottom: 10px;
                        color: #1f2937;
                    }

                    .blog-card p {
                        color: #6b7280;
                        line-height: 1.5;
                    }

                    .blog-card a {
                        display: inline-block;
                        margin-top: 8px;
                        color: #2563eb;
                        text-decoration: none;
                        font-weight: 600;
                    }

                    .blog-card a:hover {
                        text-decoration: underline;
                    }

                    .blog-card > div {
                        display: flex;
                        gap: 10px;
                        margin-top: 18px;
                    }

                    .blog-card button:last-child {
                        background: #dc2626;
                    }

                    @media (max-width: 600px) {
                        .blogs-page {
                            padding: 25px 15px 40px;
                        }

                        .blogs-title {
                            font-size: 30px;
                        }

                        .form-section {
                            padding: 20px;
                        }

                        .blog-list {
                            grid-template-columns: 1fr;
                        }
                    }
                `}
            </style>

            <div className="blogs-page">
                <div className="blogs-container">

                    <h1 className="blogs-title">
                        Blogs
                    </h1>

                    {isAdmin && (
                        <section className="form-section">

                            <h2>
                                {editingId
                                    ? 'Edit Blog'
                                    : 'Create Blog'}
                            </h2>

                            <div className="validation-info">
                                <strong>
                                    Blog Requirements
                                </strong>

                                <ul>
                                    <li>
                                        Title: 3–200 characters
                                    </li>
                                    <li>
                                        Description: 10–500 characters
                                    </li>
                                    <li>
                                        Content: minimum 20 characters
                                    </li>
                                    <li>
                                        Image: valid image URL required
                                    </li>
                                    <li>
                                        Rating: between 1 and 5
                                    </li>
                                </ul>
                            </div>

                            <form onSubmit={handleSubmit}>

                                <label className="field-label">
                                    Title
                                </label>

                                <input
                                    name="title"
                                    placeholder="Enter blog title"
                                    value={form.title}
                                    onChange={handleChange}
                                    minLength="3"
                                    maxLength="200"
                                    required
                                />

                                <label className="field-label">
                                    Description
                                </label>

                                <input
                                    name="desc"
                                    placeholder="Enter blog description"
                                    value={form.desc}
                                    onChange={handleChange}
                                    minLength="10"
                                    maxLength="500"
                                    required
                                />

                                <label className="field-label">
                                    Content
                                </label>

                                <textarea
                                    name="content"
                                    placeholder="Write your blog content"
                                    value={form.content}
                                    onChange={handleChange}
                                    minLength="20"
                                    rows="8"
                                    required
                                />

                                <label className="field-label">
                                    Image URL
                                </label>

                                <input
                                    name="image"
                                    type="url"
                                    placeholder="https://example.com/image.jpg"
                                    value={form.image}
                                    onChange={handleChange}
                                    required
                                />

                                <label className="field-label">
                                    Rating
                                </label>

                                <input
                                    name="rating"
                                    type="number"
                                    min="1"
                                    max="5"
                                    step="0.1"
                                    value={form.rating}
                                    onChange={handleChange}
                                    required
                                />

                                <button type="submit">
                                    {editingId
                                        ? 'Update Blog'
                                        : 'Create Blog'}
                                </button>

                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                    >
                                        Cancel
                                    </button>
                                )}

                            </form>

                        </section>
                    )}

                    {message && (
                        <p className="blog-message">
                            {message}
                        </p>
                    )}

                    {loading ? (
                        <p className="loading-message">
                            Loading blogs...
                        </p>
                    ) : blogs.length === 0 ? (
                        <p className="empty-message">
                            No blogs found.
                        </p>
                    ) : (
                        <div className="blog-list">

                            {blogs.map((item) => (
                                <article
                                    key={item._id}
                                    className="blog-card"
                                >

                                    <img
                                        src={item.image}
                                        alt={item.title}
                                    />

                                    <h2>
                                        {item.title}
                                    </h2>

                                    <p>
                                        {item.desc}
                                    </p>

                                    <p>
                                        Author:{' '}
                                        {item.userId?.name || 'Unknown'}
                                    </p>

                                    <p>
                                        Rating: {item.rating}/5
                                    </p>

                                    <Link
                                        to={
                                            '/blogs/' +
                                            item.slug
                                        }
                                    >
                                        View Blog
                                    </Link>

                                    {isAdmin && (
                                        <div>

                                            <button
                                                onClick={() =>
                                                    handleEdit(item)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(item._id)
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>
                                    )}

                                </article>
                            ))}

                        </div>
                    )}

                </div>
            </div>
        </>
    );
}

export default BlogsPage;