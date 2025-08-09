import { z } from 'zod';

// Email validation schema
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required');

// URL validation schema
export const urlSchema = z
  .string()
  .url('Please enter a valid URL')
  .min(1, 'URL is required');

// Support ticket validation schema
export const supportTicketSchema = z.object({
  customerName: z
    .string()
    .min(1, 'Customer name is required')
    .min(2, 'Customer name must be at least 2 characters')
    .max(100, 'Customer name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Customer name contains invalid characters'),
  
  customerEmail: emailSchema,
  
  company: z
    .string()
    .max(100, 'Company name must be less than 100 characters')
    .optional(),
  
  category: z.enum(['technical', 'billing', 'integration', 'account', 'general'], {
    errorMap: () => ({ message: 'Please select a valid category' })
  }),
  
  severity: z.enum(['low', 'medium', 'high', 'critical'], {
    errorMap: () => ({ message: 'Please select a valid severity level' })
  }),
  
  subject: z
    .string()
    .min(1, 'Subject is required')
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be less than 200 characters'),
  
  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description must be less than 5000 characters'),
  
  priority: z
    .number()
    .int('Priority must be a whole number')
    .min(1, 'Priority must be at least 1')
    .max(10, 'Priority must be at most 10')
});

// Email data validation schema
export const emailDataSchema = z.object({
  to: z.union([
    emailSchema,
    z.array(emailSchema).min(1, 'At least one recipient is required')
  ]),
  from: emailSchema.optional(),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(200, 'Subject must be less than 200 characters'),
  html: z.string().optional(),
  text: z.string().optional()
}).refine(
  (data) => data.html || data.text,
  {
    message: 'Either HTML or text content is required',
    path: ['html']
  }
);

// Environment variables validation schema
export const envSchema = z.object({
  VITE_SUPABASE_URL: urlSchema,
  VITE_SUPABASE_ANON_KEY: z
    .string()
    .min(1, 'Supabase anonymous key is required'),
  VITE_RESEND_API_KEY: z
    .string()
    .min(1, 'Resend API key is required')
    .optional(), // Optional for development
  VITE_SUPPORT_EMAIL: emailSchema.optional(),
  VITE_COMPANY_NAME: z
    .string()
    .min(1, 'Company name is required')
    .optional()
});

// MCP server validation schema
export const mcpServerSchema = z.object({
  id: z.string().min(1, 'Server ID is required'),
  name: z.string().min(1, 'Server name is required'),
  url: urlSchema,
  status: z.enum(['connected', 'disconnected', 'error']),
  tools: z.array(z.object({
    name: z.string().min(1, 'Tool name is required'),
    description: z.string(),
    inputSchema: z.record(z.unknown())
  })),
  resources: z.array(z.object({
    uri: z.string().min(1, 'Resource URI is required'),
    name: z.string().min(1, 'Resource name is required'),
    description: z.string(),
    mimeType: z.string().min(1, 'MIME type is required')
  }))
});

// Validation result type
export type ValidationResult<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
  details?: z.ZodError;
};

/**
 * Generic validation function
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult<T> {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return {
        success: false,
        error: firstError?.message || 'Validation failed',
        details: error
      };
    }
    return {
      success: false,
      error: 'Unknown validation error'
    };
  }
}

/**
 * Validate environment variables
 */
export function validateEnvironment(): ValidationResult<z.infer<typeof envSchema>> {
  const env = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    VITE_RESEND_API_KEY: import.meta.env.VITE_RESEND_API_KEY,
    VITE_SUPPORT_EMAIL: import.meta.env.VITE_SUPPORT_EMAIL,
    VITE_COMPANY_NAME: import.meta.env.VITE_COMPANY_NAME
  };

  return validateData(envSchema, env);
}

/**
 * Sanitize text input to prevent XSS
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate and sanitize user input
 */
export function validateAndSanitize<T>(
  schema: z.ZodSchema<T>, 
  data: unknown,
  sanitizeFields: string[] = []
): ValidationResult<T> {
  const validation = validateData(schema, data);
  
  if (!validation.success) {
    return validation;
  }

  // Sanitize specified fields
  const sanitizedData = { ...validation.data } as any;
  for (const field of sanitizeFields) {
    if (sanitizedData[field] && typeof sanitizedData[field] === 'string') {
      sanitizedData[field] = sanitizeText(sanitizedData[field]);
    }
  }

  return { success: true, data: sanitizedData };
}