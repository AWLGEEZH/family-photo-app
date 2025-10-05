import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  EllipsisHorizontalIcon,
  PlayIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const Gallery = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comment, setComment] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts`);
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await axios.post(`${API_URL}/posts/${postId}/like`);
      setPosts(posts.map(post =>
        post._id === postId
          ? { ...post, likes: response.data.likes }
          : post
      ));
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleComment = async (postId) => {
    if (!comment.trim()) return;

    try {
      const response = await axios.post(`${API_URL}/posts/${postId}/comments`, {
        text: comment
      });

      setPosts(posts.map(post =>
        post._id === postId
          ? { ...post, comments: [...post.comments, response.data.comment] }
          : post
      ));

      setComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const MediaItem = ({ media, index }) => {
    if (media.type === 'video') {
      return (
        <div className="relative">
          <video
            className="w-full h-full object-cover"
            controls
            preload="metadata"
          >
            <source src={media.url} type="video/mp4" />
          </video>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <PlayIcon className="h-16 w-16 text-white opacity-80" />
          </div>
        </div>
      );
    }

    return (
      <img
        src={media.url}
        alt={`Post media ${index + 1}`}
        className="w-full h-full object-cover"
      />
    );
  };

  const PostModal = ({ post, onClose }) => {
    if (!post) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-full overflow-hidden">
          <div className="flex">
            <div className="flex-1">
              {post.media.length === 1 ? (
                <MediaItem media={post.media[0]} index={0} />
              ) : (
                <div className="grid grid-cols-2 gap-1">
                  {post.media.slice(0, 4).map((media, index) => (
                    <div key={index} className="aspect-square">
                      <MediaItem media={media} index={index} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="w-80 border-l border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={post.author.profilePicture || '/api/placeholder/40/40'}
                      alt={post.author.firstName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-sm">
                        {post.author.firstName} {post.author.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(post.createdAt))} ago
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {post.caption && (
                  <p className="text-sm mb-4">{post.caption}</p>
                )}

                <div className="space-y-3">
                  {post.comments.map((comment, index) => (
                    <div key={index} className="flex space-x-2">
                      <img
                        src={comment.user.profilePicture || '/api/placeholder/32/32'}
                        alt={comment.user.firstName}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-semibold">
                            {comment.user.firstName}
                          </span>{' '}
                          {comment.text}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDistanceToNow(new Date(comment.createdAt))} ago
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => handleLike(post._id)}
                    className="flex items-center space-x-1 text-gray-700 hover:text-red-500"
                  >
                    {post.likes.some(like => like.user._id === post.author._id) ? (
                      <HeartSolidIcon className="h-6 w-6 text-red-500" />
                    ) : (
                      <HeartIcon className="h-6 w-6" />
                    )}
                    <span className="text-sm">{post.likes.length}</span>
                  </button>

                  <ChatBubbleLeftIcon className="h-6 w-6 text-gray-700" />
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleComment(post._id);
                      }
                    }}
                  />
                  <button
                    onClick={() => handleComment(post._id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Family Gallery</h1>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <PhotoIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No photos yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start sharing your family moments by uploading your first photo or video.
            </p>
            <button
              onClick={() => window.location.href = '/upload'}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Upload First Photo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedPost(post)}
              >
                <div className="aspect-square relative">
                  {post.media.length === 1 ? (
                    <MediaItem media={post.media[0]} index={0} />
                  ) : (
                    <div className="grid grid-cols-2 gap-1 h-full">
                      {post.media.slice(0, 4).map((media, index) => (
                        <div key={index} className="relative">
                          <MediaItem media={media} index={index} />
                          {index === 3 && post.media.length > 4 && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <span className="text-white text-lg font-semibold">
                                +{post.media.length - 4}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <img
                        src={post.author.profilePicture || '/api/placeholder/32/32'}
                        alt={post.author.firstName}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm font-semibold">
                        {post.author.firstName} {post.author.lastName}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(post.createdAt))} ago
                    </span>
                  </div>

                  {post.caption && (
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                      {post.caption}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(post._id);
                        }}
                        className="flex items-center space-x-1 text-gray-700 hover:text-red-500"
                      >
                        {post.likes.some(like => like.user._id === post.author._id) ? (
                          <HeartSolidIcon className="h-5 w-5 text-red-500" />
                        ) : (
                          <HeartIcon className="h-5 w-5" />
                        )}
                        <span className="text-sm">{post.likes.length}</span>
                      </button>

                      <div className="flex items-center space-x-1 text-gray-700">
                        <ChatBubbleLeftIcon className="h-5 w-5" />
                        <span className="text-sm">{post.comments.length}</span>
                      </div>
                    </div>

                    <button className="text-gray-400 hover:text-gray-600">
                      <EllipsisHorizontalIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <PostModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </div>
  );
};

export default Gallery;