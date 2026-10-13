import React, { useEffect } from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import Footer from './common/Footer';
import auth from '../config/firebase';

function Blogs() {

    const [blogs, setBlogs] = useState([]);
    const [admin, setAdmin] = useState(false)

    useEffect(() => {
        window.scrollTo(0, 0);

        auth.onAuthStateChanged(function (user) {
            if (user) {
                if (user.uid === "ZE6lH9haoTVZqISmsmceRueUJMr1") {
                    setAdmin(true)
                }
                else {
                    setAdmin(false)
                }

            }
            else {

                console.log("User Logged Out")
            }
        })

        axios.get("https://blog-portfolio-backend-251hyws1s-muruganantham1.vercel.app/api/blogs").then((res) => {
            console.log(res.data)
            setBlogs(res.data)
        }).catch(() => {
            console.log("Error fetching data")
        })


    }, [])



    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');


    const handleLike = async (blog_id) => {
        try {
            const response = await axios.patch(`https://blog-portfolio-backend-251hyws1s-muruganantham1.vercel.app/api/blogs/like/${blog_id}`);
            // After successfully updating the likes count in the backend, fetch the updated list of blogs
            if (response.status === 200) {
                axios.get("https://blog-portfolio-backend-251hyws1s-muruganantham1.vercel.app/api/blogs").then((res) => {
                    console.log(res.data)
                    setBlogs(res.data)
                }).catch(() => {
                    console.log("Error fetching data")
                })
            }
        } catch (error) {
            console.error('Error liking the blog post:', error);
        }
    };

    const handleDelete = async (blog_id) => {
        if (!window.confirm("Delete this blog?")) return;
        await axios.delete(`https://blog-portfolio-backend-251hyws1s-muruganantham1.vercel.app/api/blogs/${blog_id}`);
        setBlogs(blogs.filter((b) => b._id !== blog_id));
    };

    const startEdit = (blog) => {
        setEditingId(blog._id);
        setEditTitle(blog.newTitle);
        setEditContent(blog.newContent);
    };

    const handleUpdate = async (blog_id) => {
        const res = await axios.put(`https://blog-portfolio-backend-251hyws1s-muruganantham1.vercel.app/api/blogs/${blog_id}`, {
            newTitle: editTitle,
            newContent: editContent
        });
        setBlogs(blogs.map((b) => (b._id === blog_id ? res.data : b)));
        setEditingId(null);
    };

    const handleNewBlogSubmit = (event) => {
        event.preventDefault(); // Prevent form from refreshing the page
        const today = new Date();
        const date = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });


        const likes = 0
        axios.post("https://blog-portfolio-backend-251hyws1s-muruganantham1.vercel.app/api/blogs", { newTitle, date, newContent, likes }).then((res) => {
            console.log(res.data)

            axios.get("https://blog-portfolio-backend-251hyws1s-muruganantham1.vercel.app/api/blogs").then((res) => {
                console.log(res.data)
                setBlogs(res.data)
            }).catch(() => {
                console.log("Error fetching data")
            })

        });




        setNewTitle('');
        setNewContent('');
    };

    return (
        <div className="blog-section py-14">
            <h2 className="text-center text-5xl font-bold mb-14">Latest  <span className='text-orange-400'>Blogs</span> 📚</h2>

            {/* Blog creation form */}
            {admin ?
                <div className="blog-creation-form mb-8" style={{ width: "80%", margin: "auto" }}>
                    <form onSubmit={handleNewBlogSubmit} className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Blog Title"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="p-2 border rounded"
                            required
                        />
                        <textarea
                            placeholder="Blog Content"
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                            className="p-2 border rounded"
                            rows="4"
                            required
                        />
                        <button type="submit" className="bg-orange-400 text-white p-2 rounded hover:bg-orange-600">
                            Add Blog
                        </button>
                    </form>
                </div> : ""}

            <div className="blogs-container grid grid-cols-1 md:grid-cols-2 gap-6 container mx-auto px-4">
                {blogs.map((blog) => (
                    <div key={blog._id} className="blog-post mb-8 p-6 bg-white shadow-lg rounded-lg">
                        {editingId === blog._id ? (
                            <div className="flex flex-col gap-3">
                                <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="p-2 border rounded" />
                                <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="p-2 border rounded" rows="4" />
                                <div className="flex gap-3">
                                    <button onClick={() => handleUpdate(blog._id)} className="bg-green-500 text-white px-4 py-1 rounded">Save</button>
                                    <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-4 py-1 rounded">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <>

                                <h3 className="blog-title font-semibold text-2xl text-gray-800 mb-3">{blog.newTitle}</h3>
                                <p className="blog-date text-gray-400 text-sm mb-4">{blog.date}</p>
                                <p className="blog-content text-gray-600 mb-4">{blog.newContent}</p>
                                <span className="text-blue-500 cursor-pointer" onClick={() => handleLike(blog._id)}>Like</span>
                                <span className="ml-2">{blog.likes} Likes</span>

                                {admin && (
                                    <div className="flex gap-3 mt-4">
                                        <button onClick={() => startEdit(blog)} className="bg-blue-500 text-white px-4 py-1 rounded">Edit</button>
                                        <button onClick={() => handleDelete(blog._id)} className="bg-red-500 text-white px-4 py-1 rounded">Delete</button>
                                    </div>
                                )}
                            </>
                        )}

                    </div>
                ))}
            </div>

            <Footer />
        </div>
    );
}

export default Blogs