/**
 * Export-related types.
 */

export type ExportFormat = 'html' | 'json' | 'brief';

export interface ExportFile {
  name: string;
  content: string;
  mimeType: string;
}

export interface ExportOptions {
  format: ExportFormat;
  includeStyles: boolean;
  includeLayout: boolean;
}
