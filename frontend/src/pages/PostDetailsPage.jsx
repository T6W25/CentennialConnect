import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPostById, upvotePost, commentOnPost, clearError } from "../slices/postSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { formatDistanceToNow } from "../utils/formatDate";
import '../styles/PostDetailsPage.css';

const PostDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [commentText, setCommentText] = useState("");

  const { post, loading, error } = useSelector((state) => state.posts);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getPostById(id));
  }, [dispatch, id]);

  const handleUpvote = () => {
    dispatch(upvotePost(id));
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      dispatch(commentOnPost({ id, text: commentText }));
      setCommentText("");
    }
  };

  const hasUpvoted = post?.upvotes?.some((upvote) => upvote._id === userInfo._id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/discussions" className="text-green-600 hover:underline flex items-center">
          <span className="mr-2">←</span> Back to Discussions
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error" onClose={() => dispatch(clearError())}>
          {error}
        </Message>
      ) : post ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start space-x-4 mb-6">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                  {post.author?.profilePicture ? (
                    <img
                      src={post.author.profilePicture || "/placeholder.svg"}
                      alt={post.author.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500">👤</span>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold mb-2 text-gray-800">{post.title}</h1>
                  <div className="text-sm text-gray-500">
                    <span>{post.author?.name}</span>
                    {post.community && (
                      <>
                        <span className="mx-1">in</span>
                        <Link
                          to={`/communities/${post.community._id}`}
                          className="text-green-600 hover:underline"
                        >
                          {post.community.name}
                        </Link>
                      </>
                    )}
                    {post.group && (
                      <>
                        <span className="mx-1">in</span>
                        <Link
                          to={`/groups/${post.group._id}`}
                          className="text-green-600 hover:underline"
                        >
                          {post.group.name}
                        </Link>
                      </>
                    )}
                    <span className="mx-1">•</span>
                    <span>{formatDistanceToNow(post.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="text-gray-700 mb-6 whitespace-pre-line">{post.content}</div>

              <div className="flex items-center space-x-6">
                <button
                  onClick={handleUpvote}
                  className={`flex items-center space-x-2 ${
                    hasUpvoted ? "text-green-600" : "text-gray-500"
                  } hover:text-green-600`}
                >
                  <span>👍</span>
                  <span>{post.upvotes?.length || 0}</span>
                </button>
                <div className="flex items-center space-x-2 text-gray-500">
                  <span>💬</span>
                  <span>{post.comments?.length || 0}</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Comments</h2>
              <div className="bg-white rounded-lg shadow-md p-6">
                <form onSubmit={handleCommentSubmit} className="mb-6">
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-3"
                    rows="3"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    required
                  ></textarea>
                  <button
                    type="submit"
                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Post Comment
                  </button>
                </form>

                {post.comments?.length > 0 ? (
                  <div className="space-y-4">
                    {post.comments.map((comment, index) => (
                      <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                        <div className="flex items-start space-x-3">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            {comment.user?.profilePicture ? (
                              <img
                                src={comment.user.profilePicture || "/placeholder.svg"}
                                alt={comment.user.name}
                                className="h-8 w-8 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-gray-500 text-sm">👤</span>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center mb-1">
                              <span className="font-semibold text-sm mr-2">
                                {comment.user?.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDistanceToNow(comment.date)}
                              </span>
                            </div>
                            <p className="text-gray-700">{comment.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">No comments yet. Be the first to comment!</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {post.community && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold mb-4 text-gray-800">About Community</h2>
                <div className="mb-4">
                  <Link
                    to={`/communities/${post.community._id}`}
                    className="text-xl font-semibold text-green-600 hover:underline"
                  >
                    {post.community.name}
                  </Link>
                </div>
                <p className="text-gray-600 mb-4">{post.community.description}</p>
                <Link
                  to={`/communities/${post.community._id}`}
                  className="text-green-600 hover:underline"
                >
                  View Community
                </Link>
              </div>
            )}

            {post.group && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold mb-4 text-gray-800">About Group</h2>
                <div className="mb-4">
                  <Link
                    to={`/groups/${post.group._id}`}
                    className="text-xl font-semibold text-green-600 hover:underline"
                  >
                    {post.group.name}
                  </Link>
                </div>
                <p className="text-gray-600 mb-4">{post.group.description}</p>
                <Link
                  to={`/groups/${post.group._id}`}
                  className="text-green-600 hover:underline"
                >
                  View Group
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Message variant="error">Post not found</Message>
      )}
    </div>
  );
};

export default PostDetailsPage;