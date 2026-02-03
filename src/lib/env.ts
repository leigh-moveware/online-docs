/**
 * Environment variable configuration and validation
 * This module ensures all required environment variables are present
 * and provides type-safe access to them.
 */

// Server-side environment variables (should not be exposed to client)
export const serverEnv = {
  moveware: {
    apiKey: process.env.MOVEWARE_API_KEY || '',
    apiSecret: process.env.MOVEWARE_API_SECRET || '',
  },
  nodeEnv: process.env.NODE_ENV || 'development',
  debug: process.env.DEBUG === 'true',
} as const

// Client-side environment variables (prefixed with NEXT_PUBLIC_)
export const clientEnv = {
  moveware: {
    apiUrl: process.env.NEXT_PUBLIC_MOVEWARE_API_URL || 'https://api.moveware.com/v1',
  },
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const

/**
 * Validates that all required environment variables are set
 * Call this during application startup to fail fast if config is missing
 */
export function validateEnv() {
  const errors: string[] = []

  // Validate server-side required variables
  if (!serverEnv.moveware.apiKey && serverEnv.nodeEnv === 'production') {
    errors.push('MOVEWARE_API_KEY is required in production')
  }

  if (!serverEnv.moveware.apiSecret && serverEnv.nodeEnv === 'production') {
    errors.push('MOVEWARE_API_SECRET is required in production')
  }

  // Validate client-side required variables
  if (!clientEnv.moveware.apiUrl) {
    errors.push('NEXT_PUBLIC_MOVEWARE_API_URL is required')
  }

  if (errors.length > 0) {
    throw new Error(
      `Environment validation failed:\n${errors.map(e => `  - ${e}`).join('\n')}`
    )
  }

  return true
}

/**
 * Check if we're running in development mode
 */
export const isDevelopment = serverEnv.nodeEnv === 'development'

/**
 * Check if we're running in production mode
 */
export const isProduction = serverEnv.nodeEnv === 'production'

/**
 * Check if debug mode is enabled
 */
export const isDebug = serverEnv.debug