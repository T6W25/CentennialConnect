"use client"
import '../styles/PostCard.css';
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { upvotePost } from "../slices/postSlice"
import { formatDistanceToNow } from "../utils/formatDate"

const PostCard = ({ post }) => {
  const dispatch = useDispatch()
  const { userInfo } = useSelector((state) => state.auth)

  const hasUpvoted = post.upvotes?.includes(userInfo?._id)

  const handleUpvote = () => {
    dispatch(upvotePost(post._id))
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-start space-x-3 mb-2">
        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
          {post.author?.profilePicture ? (
            <img
              src={post.author.profilePicture || "/placeholder.svg"}
              alt={post.author.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <span className="text-gray-500">👤</span>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{post.title}</h3>
          <div className="text-xs text-gray-500">
            <span>{post.author?.name}</span>
            {post.community && (
              <>
                <span className="mx-1">in</span>
                <Link to={`/communities/${post.community._id}`} className="text-green-600 hover:underline">
                  {post.community.name}
                </Link>
              </>
            )}
            {post.group && (
              <>
                <span className="mx-1">in</span>
                <Link to={`/groups/${post.group._id}`} className="text-green-600 hover:underline">
                  {post.group.name}
                </Link>
              </>
            )}
            <span className="mx-1">•</span>
            <span>{formatDistanceToNow(post.createdAt)}</span>
          </div>
        </div>
      </div>

      <p className="text-gray-700 mb-3 line-clamp-2">{post.content}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleUpvote}
            className={`flex items-center space-x-1 ${
              hasUpvoted ? "text-green-600" : "text-gray-500"
            } hover:text-green-600`}
          >
            <span>👍</span>
            <span>{post.upvotes?.length || 0}</span>
          </button>
          <Link to={`/posts/${post._id}`} className="flex items-center space-x-1 text-gray-500 hover:text-green-600">
            <span>💬</span>
            <span>{post.comments?.length || 0}</span>
          </Link>
        </div>
        <Link to={`/posts/${post._id}`} className="text-green-600 hover:underline text-sm">
          Read More
        </Link>
      </div>
    </div>
  )
}

export default PostCard

