'use client'

import { useReducer } from 'react';

export type PdfViewerState = {
  isLoading: boolean;
  error: string | null;
  isDocumentReady: boolean;
  pdfUrl: string | null;
  numPages: number;
};

export const initialState: PdfViewerState = {
  isLoading: false,
  error: null,
  isDocumentReady: false,
  pdfUrl: null,
  numPages: 0,
};

export type PdfViewerAction =
  | { type: 'START_LOADING' }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'SET_PDF_URL'; url: string }
  | { type: 'SET_DOCUMENT_READY'; numPages: number }
  | { type: 'RESET' }
  | { type: 'CLEANUP_URL'; url: string };

export function pdfViewerReducer(state: PdfViewerState, action: PdfViewerAction): PdfViewerState {
  switch (action.type) {
    case 'START_LOADING':
      return { ...state, isLoading: true, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.error, isLoading: false };
    case 'SET_PDF_URL':
      return { ...state, pdfUrl: action.url, isLoading: false };
    case 'SET_DOCUMENT_READY':
      return { ...state, isDocumentReady: true, numPages: action.numPages };
    case 'RESET':
      return { ...initialState };
    case 'CLEANUP_URL':
      return { ...state, pdfUrl: null };
    default:
      return state;
  }
}

export function usePdfViewer() {
  return useReducer(pdfViewerReducer, initialState);
}
