/**
 * Quote-related type definitions
 */

export interface QuoteFormData {
  customerName: string;
  email: string;
  phone: string;
  address?: string;
  serviceType: string;
  moveDate?: string;
  details?: string;
  signatureData: string; // Base64 encoded signature
  typedName: string;
  acceptedTerms: boolean;
}

export interface QuoteResponse {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address?: string;
  serviceType: string;
  moveDate?: string;
  details?: string;
  signatureData: string;
  typedName: string;
  acceptedTerms: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuoteRequest {
  customerName: string;
  email: string;
  phone: string;
  address?: string;
  serviceType: string;
  moveDate?: string;
  details?: string;
  signatureData: string;
  typedName: string;
  acceptedTerms: boolean;
}

export interface CreateQuoteResponse {
  success: boolean;
  quote?: QuoteResponse;
  error?: string;
}