import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { usePosts } from '../context/PostContext'
import { useAuth } from '../context/AuthContext'
import { Calendar, User, Eye, MessageSquare, Edit, Trash2, ArrowLeft } from 'lucide-react'

const PostDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentPost, fetchPost, deletePost, addComment, loading } = usePosts()
  const { isAuthenticated, user } = useAuth()
  const [comment, setComment] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  useEffect(() => {
    fetchPost(id)
  }, [id])

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const result = await deletePost(id)
      if (result.success) {
        navigate('/posts')
      }
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return

    setIsSubmittingComment(true)
    const result = await addComment(id, { content: comment })
    if (result.success) {
      setComment('')
    }
    setIsSubmittingComment(false)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const canEdit = isAuthenticated && user && currentPost && 
    (user._id === currentPost.author._id || user.role === 'admin')

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!currentPost) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h2>
        <p className="text-gray-600 mb-6">The post you're looking for doesn't exist.</p>
        <Link
          to="/posts"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Posts
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Link
        to="/posts"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Posts
      </Link>

      {/* Post Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {currentPost.featuredImage && (
          <div className="h-64 md:h-96 bg-gray-200">
            <img
              src={currentPost.featuredImage}
              alt={currentPost.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6 md:p-8">
          {/* Post Meta */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <User className="h-4 w-4 mr-1" />
                {currentPost.author?.name}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(currentPost.createdAt)}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Eye className="h-4 w-4 mr-1" />
                {currentPost.viewCount} views
              </div>
            </div>

            {canEdit && (
              <div className="flex items-center space-x-2">
                <Link
                  to={`/edit-post/${currentPost._id}`}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Category */}
          <div className="mb-6">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: currentPost.category?.color + '20',
                color: currentPost.category?.color,
              }}
            >
              {currentPost.category?.name}
            </span>
          </div>

          {/* Post Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {currentPost.title}
          </h1>

          {/* Post Content */}
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {currentPost.content}
            </div>
          </div>

          {/* Tags */}
          {currentPost.tags && currentPost.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {currentPost.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-8 bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Comments ({currentPost.comments?.length || 0})
          </h3>
        </div>

        <div className="p-6">
          {/* Add Comment Form */}
          {isAuthenticated ? (
            <form onSubmit={handleAddComment} className="mb-6">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmittingComment || !comment.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          ) : (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600">
                <Link to="/login" className="text-blue-600 hover:text-blue-800">
                  Login
                </Link>{' '}
                to post a comment
              </p>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {currentPost.comments && currentPost.comments.length > 0 ? (
              currentPost.comments.map((comment, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {comment.user?.name?.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{comment.user?.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 ml-11">{comment.content}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetail
