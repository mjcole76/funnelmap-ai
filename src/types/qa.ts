/**
 * QA types for Copy Quality and Template Quality checks.
 */

export type IssueSeverity = 'critical' | 'warning' | 'info';

export type IssueType =
  | 'missing_product_name'
  | 'missing_audience'
  | 'missing_price'
  | 'blocked_phrase'
  | 'generic_filler'
  | 'fake_proof'
  | 'weak_cta'
  | 'too_short'
  | 'missing_section'
  | 'missing_cta_section'
  | 'placeholder_text';

export interface QualityIssue {
  id: string;
  nodeId: string;
  nodeTitle: string;
  severity: IssueSeverity;
  issueType: IssueType;
  message: string;
  section?: string;
  autoFixable: boolean;
}

export type FixStatus = 'fixed' | 'needs_manual_edit' | 'could_not_fix';

export interface FixResult {
  issue: QualityIssue;
  status: FixStatus;
  message: string;
  updatedCopy?: any;
}

// Template QA types

export type TemplateIssueType =
  | 'missing_hero'
  | 'missing_cta'
  | 'missing_pricing'
  | 'missing_guarantee'
  | 'missing_faq'
  | 'missing_checkout_form'
  | 'missing_optin_form'
  | 'missing_next_steps'
  | 'missing_email_cards'
  | 'duplicate_block'
  | 'empty_image_url'
  | 'empty_video_url'
  | 'button_no_text'
  | 'button_no_url'
  | 'poor_contrast'
  | 'empty_block'
  | 'too_many_sections_without_cta'
  | 'pricing_missing_price';

export interface TemplateQualityIssue {
  id: string;
  blockInstanceId: string;
  blockType: string;
  blockLabel: string;
  severity: IssueSeverity;
  issueType: TemplateIssueType;
  message: string;
  autoFixable: boolean;
}
