## MedSight Product Requirements Document

Mobile-first clinical decision support for breast cancer risk assessment, awareness, and support in Nigerian and West African care settings.

### 1. Product Overview

**Name:** MedSight  
**Tagline:** Intelligent Clinical Decision Support for Breast Cancer Risk Assessment  
**Built by:** Elnagi Labs

MedSight is a mobile-first intelligent decision support product for breast cancer risk assessment. It is designed to support clinicians with explainable assessment tools and to support members through guided self-assessment, awareness content, and community participation. The product is specifically intended for Nigerian and West African patient populations and clinical environments.

### 2. Problem Statement

Breast cancer is the most common cancer among women in Nigeria, yet late diagnosis remains common because access to specialist clinicians is limited and risk assessment pathways are often slow, fragmented, or unavailable at the point of need. Existing machine learning decision support tools are trained almost entirely on Western datasets from the United States and Europe, which limits their relevance and reliability for Nigerian and West African patient populations. Current tools also fail to combine multiple data modalities such as clinical records, biopsy measurements, and blood biomarkers into a single patient assessment, forcing clinicians to work with partial views of risk. Where machine learning tools do exist, they often behave as black boxes, returning an output without clear reasoning that clinicians can interpret or trust. There is also no mobile-first breast cancer decision support product designed for deployment in Nigerian teaching hospitals and similar low-resource clinical settings.

### 3. Goals and Objectives

MedSight must provide clinicians with an explainable, multi-dataset breast cancer risk assessment tool calibrated for Nigerian patient populations so that assessments are more relevant, interpretable, and usable in local clinical practice. It must give members access to a simplified, jargon-free assessment experience alongside clear awareness resources that help them understand risk and next steps without requiring clinical training. The product must foster a shared support and awareness environment where members and clinicians can participate in one community space. It must deliver a mobile-first experience that remains practical in low-resource settings, including routine use on mid-range Android devices. It must also maintain full data sovereignty so that all patient data remains within the product's own database.

### 4. Target Users

#### Member (Patient)

A member is a person seeking breast cancer risk information and support. This user does not have a clinical background and needs results in plain language. The member wants to understand personal risk level, receive clear next-step guidance, connect with others, and access breast cancer awareness content.

#### Clinician (Doctor / Researcher)

A clinician is a medical professional or researcher conducting breast cancer risk assessments. This user needs full technical detail, including risk scores, model confidence, explainability outputs, and raw feature values. The clinician needs to manage multiple patient assessments, review assessment history, and work in a verifiable professional capacity supported by a licence document, medical licence number, and institution details.

### 5. User Needs and Pain Points

| Role | Need | Pain Point Today |
| --- | --- | --- |
| Clinician | Multi-dataset risk assessment across clinical, biopsy, and blood data | No tool currently provides this in a form calibrated for Nigerian patients |
| Clinician | Explainable assessment outputs | Black-box machine learning tools provide results without reasoning |
| Clinician | Patient assessment history management | No mobile-first tool supports this workflow in the target context |
| Clinician | Batch processing for research and high-volume use | Manual entry of 30 biopsy features is impractical |
| Member | Plain language risk result | Existing tools are too clinical and difficult to understand |
| Member | Awareness content and community support | No dedicated breast cancer peer support platform exists in the Nigerian context |
| Both | A product that reflects Nigerian patient data | Existing tools rely on Western datasets and do not reflect the local population |

### 6. Features and Requirements

#### 6.1 Risk Assessment - Member

The product must provide members with a manual entry assessment flow based on clinical data only. This feature is for members who want a simple self-assessment experience. The form must collect exactly eight fields: age, menopause status, tumour size, invasive nodes, breast side, metastasis, breast quadrant, and breast disease history.

Acceptance criteria:
- The member can complete the assessment through manual data entry without any clinical or laboratory upload requirements.
- The result shows a risk level of Low, Medium, or High.
- The result shows the top contributing factors in plain language without technical jargon.
- The result shows a suggested action.
- The result shows a model limitations disclaimer.
- The member result does not show a raw risk score number.
- The member result does not show model confidence percentage.
- The member result does not show SHAP charts.
- The member result does not show cross-dataset agreement.
- The member result does not show raw feature values.

#### 6.2 Risk Assessment - Clinician

The product must provide clinicians with a detailed risk assessment workflow designed for clinical and research use. This feature is for clinicians who need both flexibility of input and full interpretability of output. The clinician workflow must support two input modes through a toggle: Batch Upload and Manual Entry. Manual entry must support clinical data and blood panel data, with blood panel age taken from clinical data rather than entered separately. Biopsy data, consisting of 30 FNA measurements, must only be available through batch upload because of input volume. Batch upload must accept a CSV file using a downloadable template containing columns for all three data types, and the system must extract whichever columns are populated.

Acceptance criteria:
- The clinician can switch between Batch Upload and Manual Entry.
- Manual Entry supports clinical data and blood panel data.
- Manual Entry does not require blood panel age to be entered separately.
- Biopsy data entry is restricted to Batch Upload.
- Batch Upload accepts a CSV file based on a downloadable template.
- The template includes columns for clinical, biopsy, and blood data.
- The system processes whichever template columns are populated.
- The clinician result includes patient ID, sample ID, date, risk score from 0 to 1, model confidence percentage, and risk level badge.
- The clinician result includes a cross-dataset agreement indicator.
- The clinician result includes SHAP-based key risk drivers ranked by contribution, including direction and percentage.
- The clinician result includes a feature contribution chart.
- The clinician result includes confidence by training dataset breakdown.
- The clinician result includes clinical guidance text.
- The clinician result includes raw feature values.
- The clinician result includes model limitations.
- The clinician result includes an out-of-distribution warning when patient values fall outside the training distribution.
- Every clinician result screen displays a prominent disclaimer stating that the product provides clinical decision support only and does not replace professional medical judgement.

#### 6.3 Assessment History - Clinician

The product must provide clinicians with a searchable history of past assessments. This feature is for clinicians who need to review, manage, and revisit prior patient assessments.

Acceptance criteria:
- The clinician can view a searchable list of all past assessments.
- Each list entry shows patient ID, sample date, risk level, risk score, and model confidence.
- The clinician can expand an entry to view the full report.
- The clinician can delete an assessment.

#### 6.4 Community (Both Roles)

The product must provide a shared community feed for members and clinicians. This feature is for both roles and must support awareness, peer support, and clinical guidance in one space. The feed must follow a Twitter/X-style interaction model, and clinicians must be visibly marked as verified.

Acceptance criteria:
- Members can create posts and replies.
- Clinicians can create posts and replies.
- Both roles can interact within a single shared feed.
- The feed follows a Twitter/X-style layout and interaction pattern.
- Clinicians display a verified badge next to their display name.
- Community content supports breast cancer awareness, peer support, and clinical guidance.

#### 6.5 Profile - Clinician

The product must provide clinicians with a profile and account area that presents identity, professional context, and verification status. This feature is for clinicians who need to establish credibility and maintain account settings.

Acceptance criteria:
- The clinician profile includes display name, avatar, username, and verified badge.
- The clinician profile includes role, institution, specialisation, experience, and location.
- The clinician account settings include email and password management.
- The clinician verification flow includes email verification.
- The clinician verification flow includes licence document upload.
- The clinician verification flow includes medical licence number capture.

#### 6.6 Profile - Member

The product must provide a member profile experience, with detailed requirements to be defined when UI design is available.

Acceptance criteria:
- The member profile feature is recognised as part of the product scope.
- Final content and interaction requirements remain pending design confirmation.

### 7. Non-Functional Requirements

MedSight must preserve clinical safety in the way it presents assessment outputs. The product must never present itself as a diagnostic tool or imply that it replaces clinician judgement. Model limitations must remain visible on every result screen so that users understand the boundaries of the assessment output. Where patient values fall outside the training distribution, the product must surface an out-of-distribution warning to clinicians clearly and consistently.

MedSight must maintain data sovereignty across all patient and user information. All patient and user data must remain within the product's own database. No third-party service that stores user identity independently may be used as the system of record for authentication or identity management.

MedSight must be suitable for the operating realities of Nigerian healthcare settings. The product must work well in low-resource clinical environments and must be mobile-first, with performance appropriate for mid-range Android devices. Distribution must be handled through APK sideload via a download website, with no dependency on app store distribution for the initial product.

MedSight must use British English for all user-facing text and must be designed around Nigerian clinical context throughout, including terminology, expectations, and content tone.

### 8. Constraints

- Mobile only; no web frontend.
- Two user roles only: member and clinician.
- No continuous model retraining in production.
- No app store distribution in the initial version.
- Payment integration is out of scope for the current version.

### 9. Success Metrics

- A clinician can complete a full risk assessment and receive an explainable report in under 3 minutes.
- A member can complete a self-assessment and receive a plain language result in under 2 minutes.
- The system correctly applies role-based access so that members cannot access clinician reports.
- Out-of-distribution warnings are surfaced on assessments where patient values exceed 3.5 standard deviations from the training distribution.
- The community feed supports post creation and interaction for both roles, with clinician badges correctly displayed.

### 10. Open Questions

1. Member result screen: final UI and content requirements to be confirmed when design is available.
2. Member profile screen: requirements to be confirmed when design is available.
3. Community screen: full feature requirements, including likes, reposts, and threads, to be confirmed when design is available.
4. Manual entry form screens for both roles: to be confirmed when design is available.
5. Batch upload result and processing screen: behaviour during processing and on error to be defined.
