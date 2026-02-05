/**
 * Moveware API types for job activities and responses
 */

export interface MovewareActivityPayload {
  activityType: 'acceptance';
  timestamp: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  serviceDetails: {
    serviceType: string;
    moveDate?: string;
    details?: string;
  };
  acceptance: {
    signatureData: string;
    typedName: string;
    acceptedTerms: boolean;
    acceptedAt: string;
  };
  selectedOptions?: Record<string, any>;
  comments?: string;
}

export interface MovewareActivityResponse {
  success: boolean;
  activityId?: string;
  jobId?: string;
  timestamp?: string;
  error?: string;
  message?: string;
}

export interface MovewareErrorResponse {
  error: string;
  code?: string;
  details?: any;
}

export interface MovewareConfig {
  apiUrl: string;
  apiKey: string;
  apiVersion: string;
}
