/**
 * Feedback Service
 * Handles bug reports, suggestions, and feedback submissions
 */

import {API_BASE_URL} from './api.config';
import ApiClient from './apiClient';

const client = new ApiClient(API_BASE_URL);

export type BugReportCategory = 'bug' | 'suggestion' | 'improvement' | 'other';
export type BugReportSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface BugReportPayload {
  title: string;
  description: string;
  category: BugReportCategory;
  severity?: BugReportSeverity;
  deviceInfo?: {
    platform?: string;
    version?: string;
    model?: string;
    osVersion?: string;
  };
  appVersion?: string;
  pageUrl?: string;
  errorStack?: string;
  screenshotUrl?: string;
  userEmail?: string;
}

export interface BugReportResponse {
  id: string;
  status: 'received' | 'processing' | 'resolved';
  message: string;
}

/**
 * Submit bug report or feedback
 * @param report - Bug report data
 * @param token - Authentication token
 * @returns Bug report response
 */
export async function submitBugReport(
  report: BugReportPayload,
  token?: string,
): Promise<BugReportResponse> {
  console.log('[FeedbackService] submitBugReport:', report.category, report.title);

  // Convert deviceInfo to JSON string if present
  const payload = {
    title: report.title,
    description: report.description,
    category: report.category,
    severity: report.severity,
    deviceInfo: report.deviceInfo ? JSON.stringify(report.deviceInfo) : undefined,
    appVersion: report.appVersion,
    pageUrl: report.pageUrl,
    errorStack: report.errorStack,
    screenshotUrl: report.screenshotUrl,
    userEmail: report.userEmail,
  };

  return client.post('/bug-reports', payload, token);
}

export const feedbackService = {
  submitBugReport,
};
