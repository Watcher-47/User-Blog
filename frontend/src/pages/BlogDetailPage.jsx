import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const API_URL = 'http://localhost:3001/api';

function BlogDetailPage() {
    const { slug } = useParams();

    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await fetch(
                    API_URL + '/blogs/' + slug
                );

                const data = await response.json();

                if (!response.ok) {
                    setMessage(
                        data.message || 'Blog not found'
                    );
                    return;
                }

                setBlog(data.data);

            } catch (error) {
                console.error(error);
                setMessage(
                    'Unable to connect to server'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [slug]);

    if (loading) {
        return (
            <>
                <style>
                    {`
                        .detail-page {
                            min-height: calc(100vh - 70px);
                            background: #f5f7fb;
                            padding: 50px 20px;
                        }

                        .detail-container {
                            max-width: 900px;
                            margin: 0 auto;
                            text-align: center;
                        }
                    `}
                </style>

                <div className="detail-page">
                    <div className="detail-container">
                        <p>Loading...</p>
                    </div>
                </div>
            </>
        );
    }

    if (!blog) {
        return (
            <>
                <style>
                    {`
                        .detail-page {
                            min-height: calc(100vh - 70px);
                            background: #f5f7fb;
                            padding: 50px 20px;
                        }

                        .detail-container {
                            max-width: 900px;
                            margin: 0 auto;
                            background: white;
                            padding: 40px;
                            border-radius: 12px;
                            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
                            text-align: center;
                        }

                        .back-link {
                            color: #2563eb;
                            text-decoration: none;
                            font-weight: 600;
                        }
                    `}
                </style>

                <div className="detail-page">
                    <div className="detail-container">

                        <h1>Blog Not Found</h1>

                        <p>{message}</p>

                        <Link
                            to="/blogs"
                            className="back-link"
                        >
                            Back to Blogs
                        </Link>

                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <style>
                {`
                    .detail-page {
                        min-height: calc(100vh - 70px);
                        background: #f5f7fb;
                        padding: 45px 20px 70px;
                    }

                    .detail-container {
                        max-width: 900px;
                        margin: 0 auto;
                        background: white;
                        padding: 40px;
                        border-radius: 14px;
                        box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
                    }

                    .back-link {
                        display: inline-block;
                        margin-bottom: 25px;
                        color: #2563eb;
                        text-decoration: none;
                        font-weight: 600;
                    }

                    .back-link:hover {
                        text-decoration: underline;
                    }

                    .detail-title {
                        margin: 0 0 15px;
                        font-size: 42px;
                        line-height: 1.2;
                        color: #1f2937;
                    }

                    .detail-meta {
                        display: flex;
                        gap: 20px;
                        flex-wrap: wrap;
                        margin-bottom: 25px;
                        color: #6b7280;
                        font-size: 15px;
                    }

                    .detail-image {
                        width: 100%;
                        max-height: 500px;
                        object-fit: cover;
                        border-radius: 10px;
                        display: block;
                        margin-bottom: 30px;
                    }

                    .detail-description {
                        font-size: 20px;
                        line-height: 1.6;
                        color: #374151;
                        margin-bottom: 25px;
                    }

                    .detail-content {
                        font-size: 17px;
                        line-height: 1.8;
                        color: #4b5563;
                        white-space: pre-wrap;
                    }

                    @media (max-width: 600px) {
                        .detail-page {
                            padding: 25px 15px 40px;
                        }

                        .detail-container {
                            padding: 25px 20px;
                        }

                        .detail-title {
                            font-size: 30px;
                        }

                        .detail-description {
                            font-size: 17px;
                        }

                        .detail-content {
                            font-size: 16px;
                        }
                    }
                `}
            </style>

            <div className="detail-page">
                <article className="detail-container">

                    <Link
                        to="/blogs"
                        className="back-link"
                    >
                        Back to Blogs
                    </Link>

                    <h1 className="detail-title">
                        {blog.title}
                    </h1>

                    <div className="detail-meta">
                        <span>
                            By {blog.userId?.name || 'Unknown'}
                        </span>

                        <span>
                            Rating: {blog.rating}/5
                        </span>
                    </div>

                    <img
                        className="detail-image"
                        src={blog.image}
                        alt={blog.title}
                    />

                    <h3 className="detail-description">
                        {blog.desc}
                    </h3>

                    <div className="detail-content">
                        {blog.content}
                    </div>

                </article>
            </div>
        </>
    );
}

export default BlogDetailPage;