import { fetchApi } from "@/lib/api";
import type {
  MemberAssessmentDetail,
  MemberAssessmentListResponse,
  MemberAssessmentSubmissionResponse,
  MemberManualAssessmentRequest,
} from "@/types/member";

export async function submitMemberAssessment(
  payload: MemberManualAssessmentRequest,
  token: string,
): Promise<MemberAssessmentSubmissionResponse> {
  return fetchApi<MemberAssessmentSubmissionResponse>("/api/member/manual-assess", {
    method: "POST",
    body: payload as unknown as Record<string, unknown>,
    token,
  });
}

export async function getMemberAssessment(
  id: string,
  token: string,
): Promise<MemberAssessmentDetail> {
  return fetchApi<MemberAssessmentDetail>(`/api/member/assessments/${id}`, {
    method: "GET",
    token,
  });
}

export async function listMemberAssessments(
  token: string,
  options: { status?: "Success" | "High risk"; page?: number; page_size?: number } = {},
): Promise<MemberAssessmentListResponse> {
  const params: Record<string, string | number> = {};

  if (options.status) params.status = options.status;
  if (options.page) params.page = options.page;
  if (options.page_size) params.page_size = options.page_size;

  return fetchApi<MemberAssessmentListResponse>("/api/member/assessments", {
    method: "GET",
    params,
    token,
  });
}
