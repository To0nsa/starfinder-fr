import React from 'react';
import { AuthProvider } from '/src/contexts/AuthContext';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '/src/routes/ProtectedRoute';
import Homepage from '../Components/Pages/Homepage/Homepage';
import SignUp from '../Components/Auth/SignUp';
import Login from '../Components/Auth/Login';
import Profilepage from '/src/Components/Pages/Profilepage/Profilepage';
import TranslatedBlogPostForm from '/src/Components/Blog/TradPaizoBlog/TranslatedBlogPostForm';
import TranslatedBlogCards from '/src/Components/Blog/TradPaizoBlog/TranslatedBlogCards';
import TranslatedBlogPost from '/src/Components/Blog/TradPaizoBlog/TranslatedBlogPost';
import BlogPostForm from '/src/Components/Blog/BlogSfFr/BlogPostForm';
import BlogCards from '/src/Components/Blog/BlogSfFr/BlogCards';
import BlogPost from '/src/Components/Blog/BlogSfFr/BlogPost';

const RoutesComponent = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profilepage" element={
          <ProtectedRoute>
            <Profilepage />
          </ProtectedRoute>
        } />
        <Route path="/tradPaizoBlogForm" element={
          <ProtectedRoute>
            <TranslatedBlogPostForm />
          </ProtectedRoute>
        } />
        <Route path="/edit-tradPaizoBlogPost/:postId" element={
          <ProtectedRoute>
            <TranslatedBlogPostForm />
          </ProtectedRoute>
        } />
        <Route path="/blogForm" element={
          <ProtectedRoute>
            <BlogPostForm />
          </ProtectedRoute>
        } />
        <Route path="/edit-post/:postId" element={
          <ProtectedRoute>
            <BlogPostForm />
          </ProtectedRoute>
        } />
        <Route path="/tradPaizoBlogCards" element={<TranslatedBlogCards />} />
        <Route path="/tradPaizoBlogPosts/:postId" element={<TranslatedBlogPost />} />
        <Route path="/blogCards" element={<BlogCards />} />
        <Route path="/posts/:postId" element={<BlogPost />} />
      </Routes>
    </AuthProvider>
  );
};

export default RoutesComponent;