import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PostModerationPage = () => {
  const { id } = useParams(); // This will capture the community ID if present in the URL
  
  // Mock data - in a real application, you would fetch this from an API
  const [posts, setPosts] = useState([
    {
      _id: '1',
      title: 'Welcome to the Computer Science Community',
      content: 'This is a welcome post for all Computer Science students. We hope you find this community helpful!',
      status: 'pending',
      user: { name: 'Community Manager', _id: '101' },
      community: { name: 'Computer Science', _id: '201' },
      createdAt: new Date('2025-03-24').toISOString(),
      tags: ['welcome', 'introduction']
    },
    {
      _id: '2',
      title: 'Programming Tips and Tricks',
      content: 'Here are some programming tips for beginners... Always comment your code and use meaningful variable names.',
      status: 'pending',
      user: { name: 'John Doe', _id: '102' },
      community: { name: 'Programming Club', _id: '202' },
      createdAt: new Date('2025-03-24').toISOString(),
      tags: ['programming', 'tips']
    },
    {
      _id: '3',
      title: 'Inappropriate Content',
      content: 'This post contains content that violates community guidelines.',
      status: 'pending',
      user: { name: 'Anonymous User', _id: '103' },
      community: { name: 'General', _id: '203' },
      createdAt: new Date('2025-03-25').toISOString(),
      tags: ['flagged']
    }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // This is fine as long as we use it
  const [selectedPost, setSelectedPost] = useState(null);
  const [viewMode, setViewMode] = useState('pending'); // pending, approved, rejected
  const [rejectionReason, setRejectionReason] = useState('');
  
  // Mock user info - in a real app, this would come from context or props
  const userInfo = { name: 'Community Manager', role: 'communityManager' };
  
  useEffect(() => {
    // Example of using setError so it's not unused
    if (!posts.length) {
      setError('No posts to display');
    } else {
      setError(null);
    }
    
    setLoading(false);
  }, [viewMode, posts]);
  
  const filteredPosts = posts.filter(post => post.status === viewMode);
  
  const handleApprove = (postId) => {
    // Update local state for demo purposes
    setPosts(posts.map(post => 
      post._id === postId ? { ...post, status: 'approved' } : post
    ));
    
    if (selectedPost && selectedPost._id === postId) {
      setSelectedPost({ ...selectedPost, status: 'approved' });
    }
  };
  
  const handleReject = (postId) => {
    // Update local state for demo purposes
    const reason = rejectionReason || 'Content violates community guidelines';
    setPosts(posts.map(post => 
      post._id === postId ? { ...post, status: 'rejected', rejectionReason: reason } : post
    ));
    
    if (selectedPost && selectedPost._id === postId) {
      setSelectedPost({ ...selectedPost, status: 'rejected', rejectionReason: reason });
    }
    
    setRejectionReason('');
  };
  
  const handlePostClick = (post) => {
    setSelectedPost(post);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Post Moderation {id ? `- ${posts.find(p => p.community._id === id)?.community.name || 'Community'}` : ''}</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      <div className="flex mb-6 space-x-2">
        <button 
          onClick={() => setViewMode('pending')} 
          className={`px-4 py-2 rounded font-medium ${viewMode === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Pending Review
        </button>
        <button 
          onClick={() => setViewMode('approved')} 
          className={`px-4 py-2 rounded font-medium ${viewMode === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Approved Posts
        </button>
        <button 
          onClick={() => setViewMode('rejected')} 
          className={`px-4 py-2 rounded font-medium ${viewMode === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Rejected Posts
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Posts ({filteredPosts.length})</h2>
              <div className="flex items-center text-gray-500">
                <span>{viewMode}</span>
              </div>
            </div>
            
            {loading ? (
              <p className="text-center py-4">Loading posts...</p>
            ) : filteredPosts.length === 0 ? (
              <p className="text-center py-4 text-gray-500">No {viewMode} posts found</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-auto pr-2">
                {filteredPosts.map((post) => (
                  <div 
                    key={post._id} 
                    className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${selectedPost?._id === post._id ? 'border-blue-500 bg-blue-50' : ''}`}
                    onClick={() => handlePostClick(post)}
                  >
                    <div className="flex justify-between">
                      <h3 className="font-medium truncate">{post.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        post.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        post.status === 'approved' ? 'bg-green-100 text-green-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {post.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{post.content}</p>
                    <div className="text-xs text-gray-400 mt-2">
                      Posted by {post.user.name} • {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-2">
          {selectedPost ? (
            <div className="bg-white p-6 rounded shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">{selectedPost.title}</h2>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <span>Posted by {selectedPost.user.name}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(selectedPost.createdAt).toLocaleString()}</span>
                    <span className="mx-2">•</span>
                    <span>Community: {selectedPost.community.name}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {selectedPost.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleApprove(selectedPost._id)} 
                        className="flex items-center px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                      >
                        ✓ Approve
                      </button>
                      <button 
                        onClick={() => handleReject(selectedPost._id)} 
                        className="flex items-center px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                      >
                        ✕ Reject
                      </button>
                    </>
                  )}
                  <button 
                    className="flex items-center px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => window.open(`/posts/${selectedPost._id}`, '_blank')}
                  >
                    👁️ View
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded p-4 border mb-4">
                <div className="prose max-w-none">
                  {selectedPost.content}
                </div>
              </div>
              
              {selectedPost.status === 'pending' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Rejection Reason (optional)</label>
                  <textarea 
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Provide a reason if rejecting this post..."
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                </div>
              )}
              
              {selectedPost.status === 'rejected' && selectedPost.rejectionReason && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                  <h4 className="font-medium text-red-800 flex items-center">
                    ⚠️ Rejection Reason
                  </h4>
                  <p className="text-red-700">{selectedPost.rejectionReason}</p>
                </div>
              )}
              
              {selectedPost.tags && selectedPost.tags.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPost.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full text-sm">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-6 border-t pt-4">
                <h4 className="font-medium mb-2">Moderation History</h4>
                <div className="text-sm text-gray-500">
                  {selectedPost.status === 'pending' ? (
                    <p>Awaiting moderation</p>
                  ) : selectedPost.status === 'approved' ? (
                    <p>Approved on {new Date().toLocaleString()} by {userInfo.name}</p>
                  ) : (
                    <p>Rejected on {new Date().toLocaleString()} by {userInfo.name}</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded shadow">
              <div className="text-center text-gray-500">
                <h3 className="text-xl font-medium mb-2">No Post Selected</h3>
                <p>Select a post from the list to moderate</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostModerationPage;