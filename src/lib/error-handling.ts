/**
 * Standardized error handling utilities
 */

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: unknown;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: ApiError;
  message: string;
}

/**
 * Create a standardized success response
 */
export function createSuccessResponse<T>(data: T, message: string = 'Operation successful'): ApiResponse<T> {
  return {
    success: true,
    data,
    message
  };
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  message: string,
  details?: ApiError,
  code?: string
): ApiResponse<never> {
  return {
    success: false,
    error: message,
    message: `Error: ${message}`,
    details: details ? { ...details, code } : { message, code }
  };
}

/**
 * Enhanced error handler with retry logic
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000,
  backoffMultiplier: number = 2
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        break;
      }
      
      // Don't retry on certain error types
      if (isNonRetryableError(error)) {
        break;
      }
      
      // Wait before retrying with exponential backoff
      const delay = delayMs * Math.pow(backoffMultiplier, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms:`, error);
    }
  }
  
  throw lastError!;
}

/**
 * Determine if an error should not be retried
 */
function isNonRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    // Don't retry validation errors, authentication errors, etc.
    const nonRetryableMessages = [
      'validation',
      'unauthorized',
      'forbidden',
      'invalid',
      'malformed',
      'bad request'
    ];
    
    return nonRetryableMessages.some(msg => 
      error.message.toLowerCase().includes(msg)
    );
  }
  
  return false;
}

/**
 * Enhanced error handler with timeout
 */
export async function withTimeout<T>(
  operation: () => Promise<T>,
  timeoutMs: number = 30000,
  timeoutMessage: string = 'Operation timed out'
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, timeoutMs);
  });
  
  return Promise.race([operation(), timeoutPromise]);
}

/**
 * Combine retry and timeout logic
 */
export async function withRetryAndTimeout<T>(
  operation: () => Promise<T>,
  options: {
    maxRetries?: number;
    delayMs?: number;
    backoffMultiplier?: number;
    timeoutMs?: number;
    timeoutMessage?: string;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    delayMs = 1000,
    backoffMultiplier = 2,
    timeoutMs = 30000,
    timeoutMessage = 'Operation timed out'
  } = options;
  
  return withRetry(
    () => withTimeout(operation, timeoutMs, timeoutMessage),
    maxRetries,
    delayMs,
    backoffMultiplier
  );
}

/**
 * Safe async operation wrapper
 */
export async function safeAsync<T>(
  operation: () => Promise<T>,
  errorMessage: string = 'Operation failed'
): Promise<ApiResponse<T>> {
  try {
    const result = await operation();
    return createSuccessResponse(result);
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : String(error),
      code: getErrorCode(error),
      details: error
    };
    
    return createErrorResponse(errorMessage, apiError);
  }
}

/**
 * Extract error code from various error types
 */
function getErrorCode(error: unknown): string {
  if (error && typeof error === 'object') {
    if ('code' in error && typeof error.code === 'string') {
      return error.code;
    }
    if ('status' in error && typeof error.status === 'number') {
      return `HTTP_${error.status}`;
    }
    if ('statusCode' in error && typeof error.statusCode === 'number') {
      return `HTTP_${error.statusCode}`;
    }
  }
  
  return 'UNKNOWN_ERROR';
}

/**
 * Log structured errors
 */
export function logError(
  context: string,
  error: unknown,
  metadata?: Record<string, unknown>
): void {
  const errorInfo = {
    context,
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : error,
    metadata,
    timestamp: new Date().toISOString()
  };
  
  console.error('Error occurred:', errorInfo);
}

/**
 * Enhanced error boundary for React components
 */
export class ErrorBoundary extends Error {
  public readonly code: string;
  public readonly statusCode?: number;
  public readonly details?: unknown;
  
  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    statusCode?: number,
    details?: unknown
  ) {
    super(message);
    this.name = 'ErrorBoundary';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
  
  toApiError(): ApiError {
    return {
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details
    };
  }
}