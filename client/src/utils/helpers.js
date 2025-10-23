// Utility helper functions

import { format, parseISO, isValid } from 'date-fns'

/**
 * Format a date string to a readable format
 * @param {string} dateString - ISO date string
 * @param {string} formatString - Date format string
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, formatString = 'MMM dd, yyyy') => {
  if (!dateString) return ''
  
  try {
    const date = parseISO(dateString)
    if (!isValid(date)) return ''
    return format(date, formatString)
  } catch (error) {
    console.error('Date formatting error:', error)
    return ''
  }
}

/**
 * Format a date to relative time (e.g., "2 hours ago")
 * @param {string} dateString - ISO date string
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return ''
  
  try {
    const date = parseISO(dateString)
    if (!isValid(date)) return ''
    
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
    
    return format(date, 'MMM dd, yyyy')
  } catch (error) {
    console.error('Relative time formatting error:', error)
    return ''
  }
}

/**
 * Truncate text to a specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 150) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

/**
 * Generate a slug from a string
 * @param {string} text - Text to convert to slug
 * @returns {string} URL-friendly slug
 */
export const generateSlug = (text) => {
  if (!text) return ''
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

/**
 * Capitalize the first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Format a number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  if (typeof num !== 'number') return '0'
  return num.toLocaleString()
}

/**
 * Get initials from a name
 * @param {string} name - Full name
 * @returns {string} Initials
 */
export const getInitials = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Generate a random color for categories
 * @returns {string} Hex color code
 */
export const generateRandomColor = () => {
  const colors = [
    '#3b82f6', // blue
    '#10b981', // emerald
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // violet
    '#06b6d4', // cyan
    '#84cc16', // lime
    '#f97316', // orange
    '#ec4899', // pink
    '#6b7280', // gray
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

/**
 * Debounce function to limit API calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Check if user has permission
 * @param {Object} user - User object
 * @param {string} permission - Permission to check
 * @returns {boolean} True if user has permission
 */
export const hasPermission = (user, permission) => {
  if (!user) return false
  
  const permissions = {
    admin: ['read', 'write', 'delete', 'manage'],
    user: ['read', 'write'],
  }
  
  return permissions[user.role]?.includes(permission) || false
}

/**
 * Format file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Generate a unique ID
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}

/**
 * Check if a string is empty or contains only whitespace
 * @param {string} str - String to check
 * @returns {boolean} True if empty or whitespace only
 */
export const isEmpty = (str) => {
  return !str || str.trim().length === 0
}

/**
 * Remove HTML tags from a string
 * @param {string} html - HTML string
 * @returns {string} Plain text
 */
export const stripHtml = (html) => {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '')
}

/**
 * Get the first paragraph from HTML content
 * @param {string} html - HTML content
 * @param {number} maxLength - Maximum length
 * @returns {string} First paragraph
 */
export const getFirstParagraph = (html, maxLength = 200) => {
  if (!html) return ''
  
  const plainText = stripHtml(html)
  return truncateText(plainText, maxLength)
}
