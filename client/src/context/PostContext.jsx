import { createContext, useContext, useReducer } from 'react'
import { postService, categoryService } from '../services/api'
import toast from 'react-hot-toast'

const PostContext = createContext()

const initialState = {
  posts: [],
  categories: [],
  currentPost: null,
  loading: false,
  error: null,
}

const postReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      }
    case 'SET_POSTS':
      return {
        ...state,
        posts: action.payload,
        loading: false,
        error: null,
      }
    case 'SET_CURRENT_POST':
      return {
        ...state,
        currentPost: action.payload,
        loading: false,
        error: null,
      }
    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.payload,
        loading: false,
        error: null,
      }
    case 'ADD_POST':
      return {
        ...state,
        posts: [action.payload, ...state.posts],
        loading: false,
        error: null,
      }
    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === action.payload._id ? action.payload : post
        ),
        currentPost: state.currentPost?._id === action.payload._id ? action.payload : state.currentPost,
        loading: false,
        error: null,
      }
    case 'DELETE_POST':
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== action.payload),
        currentPost: state.currentPost?._id === action.payload ? null : state.currentPost,
        loading: false,
        error: null,
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

export const PostProvider = ({ children }) => {
  const [state, dispatch] = useReducer(postReducer, initialState)

  // Fetch all posts
  const fetchPosts = async (page = 1, limit = 10, category = null, search = '') => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await postService.getAllPosts(page, limit, category, search)
      if (response.success) {
        dispatch({ type: 'SET_POSTS', payload: response.data })
        return response
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error })
        return response
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return { success: false, error: error.message }
    }
  }

  // Fetch single post
  const fetchPost = async (id) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await postService.getPost(id)
      if (response.success) {
        dispatch({ type: 'SET_CURRENT_POST', payload: response.data })
        return response
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error })
        return response
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return { success: false, error: error.message }
    }
  }

  // Create new post
  const createPost = async (postData) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await postService.createPost(postData)
      if (response.success) {
        dispatch({ type: 'ADD_POST', payload: response.data })
        toast.success('Post created successfully!')
        return response
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error })
        toast.error(response.error || 'Failed to create post')
        return response
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      toast.error('Failed to create post')
      return { success: false, error: error.message }
    }
  }

  // Update post
  const updatePost = async (id, postData) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await postService.updatePost(id, postData)
      if (response.success) {
        dispatch({ type: 'UPDATE_POST', payload: response.data })
        toast.success('Post updated successfully!')
        return response
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error })
        toast.error(response.error || 'Failed to update post')
        return response
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      toast.error('Failed to update post')
      return { success: false, error: error.message }
    }
  }

  // Delete post
  const deletePost = async (id) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await postService.deletePost(id)
      if (response.success) {
        dispatch({ type: 'DELETE_POST', payload: id })
        toast.success('Post deleted successfully!')
        return response
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error })
        toast.error(response.error || 'Failed to delete post')
        return response
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      toast.error('Failed to delete post')
      return { success: false, error: error.message }
    }
  }

  // Add comment to post
  const addComment = async (postId, commentData) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await postService.addComment(postId, commentData)
      if (response.success) {
        dispatch({ type: 'SET_CURRENT_POST', payload: response.data })
        toast.success('Comment added successfully!')
        return response
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error })
        toast.error(response.error || 'Failed to add comment')
        return response
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      toast.error('Failed to add comment')
      return { success: false, error: error.message }
    }
  }

  // Fetch categories
  const fetchCategories = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await categoryService.getAllCategories()
      if (response.success) {
        dispatch({ type: 'SET_CATEGORIES', payload: response.data })
        return response
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error })
        return response
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return { success: false, error: error.message }
    }
  }

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value = {
    ...state,
    fetchPosts,
    fetchPost,
    createPost,
    updatePost,
    deletePost,
    addComment,
    fetchCategories,
    clearError,
  }

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>
}

export const usePosts = () => {
  const context = useContext(PostContext)
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider')
  }
  return context
}
