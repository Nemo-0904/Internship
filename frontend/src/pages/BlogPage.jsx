import React from "react";

const blogs = [
  {
    id: 1,
    title: "Understanding URDF in Robotics",
    author: "Nithya Cherala",
    date: "July 25, 2025",
    content:
      "URDF (Unified Robot Description Format) is an XML format for representing a robot model. It defines the joints, links, and visual structure of the robot...",
  },
  {
    id: 2,
    title: "MediaPipe + React for Real-Time Pose Tracking",
    author: "Nithya Cherala",
    date: "July 24, 2025",
    content:
      "MediaPipe is a powerful tool for real-time computer vision. Integrating it with React can help you build interactive experiences like gesture-controlled robots...",
  },
  {
    id: 3,
    title: "How to Host Flask APIs on Render",
    author: "Nithya Cherala",
    date: "July 20, 2025",
    content:
      "Render provides an easy way to deploy Flask backends for robotics dashboards, remote controls, or full-stack ML projects...",
  },
];

const BlogCard = ({ title, author, date, content }) => (
  <div className="blog-card">
    <h2>{title}</h2>
    <p className="meta">
      By <strong>{author}</strong> | {date}
    </p>
    <p className="excerpt">{content}</p>
    <button className="read-more">Read More</button>
  </div>
);

const BlogPage = () => {
  return (
    <div className="blog-page">
      <h1>Tech Blogs</h1>
      <div className="blog-grid">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} {...blog} />
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
