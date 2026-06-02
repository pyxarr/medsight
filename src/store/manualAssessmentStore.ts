import { create } from "zustand";

export interface ClinicalData {
  age: string;
  menopause: "premenopausal" | "postmenopausal" | "";
  tumor_size_cm: string;
  invasive_nodes: string;
  breast_side: "left" | "right" | "";
  metastasis: "no" | "yes" | "";
  breast_quadrant: "upper outer" | "upper inner" | "lower outer" | "lower inner" | "";
  breast_disease_history: "no" | "yes" | "";
}

export interface BloodPanelData {
  body_mass_index: string;
  glucose: string;
  insulin: string;
  homeostasis_model_assessment: string;
  leptin: string;
  adiponectin: string;
  resistin: string;
  monocyte_chemoattractant_protein: string;
}

interface AssessmentState {
  firstName: string;
  lastName: string;
  clinicalData: Partial<ClinicalData>;
  bloodData: Partial<BloodPanelData>;
  setPatientInfo: (info: { firstName?: string; lastName?: string }) => void;
  setClinicalData: (data: Partial<ClinicalData>) => void;
  setBloodData: (data: Partial<BloodPanelData>) => void;
  resetAssessment: () => void;
}

const initialClinicalData: Partial<ClinicalData> = {};
const initialBloodData: Partial<BloodPanelData> = {};

export const useManualAssessmentStore = create<AssessmentState>((set) => ({
  firstName: "",
  lastName: "",
  clinicalData: initialClinicalData,
  bloodData: initialBloodData,

  setPatientInfo: (info) =>
    set((state) => ({
      firstName: info.firstName ?? state.firstName,
      lastName: info.lastName ?? state.lastName,
    })),

  setClinicalData: (data) =>
    set((state) => ({
      clinicalData: { ...state.clinicalData, ...data },
    })),

  setBloodData: (data) =>
    set((state) => ({
      bloodData: { ...state.bloodData, ...data },
    })),

  resetAssessment: () =>
    set({
      firstName: "",
      lastName: "",
      clinicalData: initialClinicalData,
      bloodData: initialBloodData,
    }),
}));

