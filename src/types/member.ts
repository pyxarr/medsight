export interface MemberClinicalDataRequest {
  age: number | string;
  menopause_status: "premenopausal" | "postmenopausal";
  tumour_size_cm: number | string;
  invasive_nodes: number | string;
  breast_side: "left" | "right";
  metastasis: "no" | "yes";
  breast_quadrant: "upper outer" | "upper inner" | "lower outer" | "lower inner";
  breast_disease_history: "no" | "yes";
}

export interface MemberManualAssessmentRequest {
  first_name: string;
  last_name: string;
  patient_id?: string;
  clinical_data: MemberClinicalDataRequest;
}

export interface MemberAssessmentFactor {
  feature: string;
  explanation: string;
}

export interface MemberOodWarning {
  has_warning: boolean;
  flagged_features: string[];
  severity: "Minor" | "Major" | null;
}

export interface MemberAssessmentDetail {
  assessment_id: string;
  patient_id: string;
  patient_name: string;
  sample_date: string;
  risk_level: "Low" | "Medium" | "High";
  top_factors: MemberAssessmentFactor[];
  suggested_action: string;
  model_limitations: string;
  ood_warning: MemberOodWarning | null;
  created_at: string;
}

export interface MemberAssessmentSubmissionResponse {
  assessment_id: string;
  patient_id: string;
  risk_level: "Low" | "Medium" | "High";
  top_factors: MemberAssessmentFactor[];
  suggested_action: string;
  model_limitations: string;
  ood_warning: MemberOodWarning | null;
  created_at: string;
}

export interface MemberAssessmentSummary {
  id: string;
  patient_name: string;
  patient_id: string;
  risk_level: "Low" | "Medium" | "High";
  status: "Success" | "High risk";
  created_at: string;
}

export interface MemberAssessmentListResponse {
  total: number;
  page: number;
  page_size: number;
  results: MemberAssessmentSummary[];
}
