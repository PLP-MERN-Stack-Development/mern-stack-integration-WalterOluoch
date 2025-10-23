import { createContext, useContext, useReducer, useEffect } from 'react'
import { authService } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
      }
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      }
    case 'AUTH_FAIL':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const response = await authService.getCurrentUser()
          if (response.success) {
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: {
                user: response.data,
                token,
              },
            })
          } else {
            dispatch({ type: 'AUTH_FAIL' })
          }
        } catch (error) {
          dispatch({ type: 'AUTH_FAIL' })
        }
      } else {
        dispatch({ type: 'AUTH_FAIL' })
      }
    }

    checkAuth()
  }, [])

  // Login function
  const login = async (credentials) => {
    dispatch({ type: 'AUTH_START' })
    try {
      const response = await authService.login(credentials)
      if (response.success) {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: response.user,
            token: response.token,
          },
        })
        toast.success('Login successful!')
        return { success: true }
      } else {
        dispatch({ type: 'AUTH_FAIL' })
        toast.error(response.error || 'Login failed')
        return { success: false, error: response.error }
      }
    } catch (error) {
      dispatch({ type: 'AUTH_FAIL' })
      toast.error('Login failed. Please try again.')
      return { success: false, error: error.message }
    }
  }

  // Register function
  const register = async (userData) => {
    dispatch({ type: 'AUTH_START' })
    try {
      const response = await authService.register(userData)
      if (response.success) {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: response.user,
            token: response.token,
          },
        })
        toast.success('Registration successful!')
        return { success: true }
      } else {
        dispatch({ type: 'AUTH_FAIL' })
        toast.error(response.error || 'Registration failed')
        return { success: false, error: response.error }
      }
    } catch (error) {
      dispatch({ type: 'AUTH_FAIL' })
      toast.error('Registration failed. Please try again.')
      return { success: false, error: error.message }
    }
  }

  // Logout function
  const logout = () => {
    authService.logout()
    dispatch({ type: 'LOGOUT' })
    toast.success('Logged out successfully')
  }

  // Update user profile
  const updateProfile = (userData) => {
    dispatch({
      type: 'UPDATE_USER',
      payload: userData,
    })
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
