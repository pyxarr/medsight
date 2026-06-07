const FIELD_LABELS: Record<string, string> = {
  menopause: "Menopause Status",
  tumor_size_cm: "Tumor Size",
  invasive_nodes: "Invasive Nodes",
  breast_side: "Breast Side",
  metastasis: "Metastasis",
  breast_quadrant: "Breast Quadrant",
  breast_disease_history: "Breast Disease History",
};

export function parseValidationErrors(raw: string): string | null {
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.detail && Array.isArray(parsed.detail)) {
      const missingFields = parsed.detail
        .filter((item: any) => item.type === "missing")
        .map((item: any) => {
          const key = item.loc?.slice(-1)[0];
          return FIELD_LABELS[key] || key;
        });
      if (missingFields.length > 0) {
        return `Please fill in the required fields:\n${missingFields.join(", ")}`;
      }
    }
  } catch {}
  return null;
}
