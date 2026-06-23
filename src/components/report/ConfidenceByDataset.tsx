import { View, Text, useWindowDimensions } from "react-native";
import { Svg, Rect, Line, Text as SvgText, G } from "react-native-svg";

interface ConfidenceByDatasetProps {
  scores: Record<string, number>;
  riskScore: number;
}

const DATASET_LABELS: Record<string, string> = {
  wisconsin: "WDBC",
  ucth: "UCTH",
  coimbra: "Coimbra",
};

const RECOGNISED_KEYS = Object.keys(DATASET_LABELS);

const BAR_HEIGHT = 16;
const ROW_HEIGHT = 36;
const LABEL_WIDTH = 64;
const RIGHT_LABEL_WIDTH = 48;
const X_AXIS_HEIGHT = 28;
const X_AXIS_LABELS = [0, 25, 50, 75, 100];

function getBarColour(value: number): string {
  if (value >= 0.85) return "#22C55E";
  if (value >= 0.7) return "#F59E0B";
  return "#EF4444";
}

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function ConfidenceByDataset({ scores, riskScore }: ConfidenceByDatasetProps) {
  const { width: screenWidth } = useWindowDimensions();

  const recognisedEntries = RECOGNISED_KEYS
    .map((key) => ({ key, label: DATASET_LABELS[key], value: scores[key] }))
    .filter((entry) => entry.value !== undefined && entry.value !== null);

  if (recognisedEntries.length === 0) return null;

  const trackWidth = screenWidth - 40 - LABEL_WIDTH - RIGHT_LABEL_WIDTH;
  const barAreaHeight = recognisedEntries.length * ROW_HEIGHT;
  const chartHeight = barAreaHeight + X_AXIS_HEIGHT;
  const ensembleAvg = riskScore;
  const ensembleX = Math.min(ensembleAvg * trackWidth, trackWidth);
  const xAxisY = barAreaHeight;

  return (
    <View className="mx-5">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-sm font-semibold text-gray-900">
          Confidence by Training Dataset
        </Text>
        <View className="w-5 h-5 rounded-full border border-gray-300 items-center justify-center">
          <Text className="text-xs text-gray-400 italic">i</Text>
        </View>
      </View>

      {/* Card */}
      <View className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <Svg width={trackWidth + LABEL_WIDTH + RIGHT_LABEL_WIDTH} height={chartHeight}>
          {recognisedEntries.map((entry, index) => {
            const y = index * ROW_HEIGHT + (ROW_HEIGHT - BAR_HEIGHT) / 2;
            const fillWidth = Math.min(entry.value * trackWidth, trackWidth);
            const labelX = LABEL_WIDTH;

            return (
              <View key={entry.key}>
                {/* Label */}
                <Text
                  className="text-xs text-gray-700 font-medium"
                  style={{ position: "absolute", left: 0, top: y - 2, width: LABEL_WIDTH }}
                >
                  {entry.label}
                </Text>

                {/* Track */}
                <Rect
                  x={labelX}
                  y={y}
                  width={trackWidth}
                  height={BAR_HEIGHT}
                  fill="#F3F4F6"
                  rx={4}
                />

                {/* Fill bar */}
                <Rect
                  x={labelX}
                  y={y}
                  width={fillWidth}
                  height={BAR_HEIGHT}
                  fill={getBarColour(entry.value)}
                  rx={4}
                />

                {/* Percentage label */}
                <Text
                  className="text-xs text-gray-600 font-medium"
                  style={{
                    position: "absolute",
                    left: labelX + trackWidth + 4,
                    top: y - 2,
                    width: RIGHT_LABEL_WIDTH,
                  }}
                >
                  {formatPercent(entry.value)}
                </Text>
              </View>
            );
          })}

          {/* Ensemble dashed line */}
          <Line
            x1={LABEL_WIDTH + ensembleX}
            y1={0}
            x2={LABEL_WIDTH + ensembleX}
            y2={barAreaHeight}
            stroke="#3B82F6"
            strokeWidth={1.5}
            strokeDasharray="4 3"
          />

          {/* X-axis line */}
          <Line
            x1={LABEL_WIDTH}
            y1={xAxisY}
            x2={LABEL_WIDTH + trackWidth}
            y2={xAxisY}
            stroke="#D1D5DB"
            strokeWidth={1}
          />

          {/* X-axis tick marks and labels */}
          {X_AXIS_LABELS.map((pct) => {
            const x = LABEL_WIDTH + (pct / 100) * trackWidth;
            return (
              <G key={pct}>
                {/* Tick mark */}
                <Line
                  x1={x}
                  y1={xAxisY}
                  x2={x}
                  y2={xAxisY + 6}
                  stroke="#9CA3AF"
                  strokeWidth={1}
                />
                {/* Label */}
                <SvgText
                  x={x}
                  y={xAxisY + 18}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#6B7280"
                >
                  {`${pct}%`}
                </SvgText>
              </G>
            );
          })}
        </Svg>

        {/* Legend */}
        <View className="flex-row items-center gap-3 mt-3 flex-wrap">
          <View className="flex-row items-center gap-1.5">
            <View className="w-3 h-3 rounded-full bg-[#22C55E]" />
            <Text className="text-xs text-gray-500">≥85%</Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <View className="w-3 h-3 rounded-full bg-[#F59E0B]" />
            <Text className="text-xs text-gray-500">70–84%</Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <View className="w-3 h-3 rounded-full bg-[#EF4444]" />
            <Text className="text-xs text-gray-500">&lt;70%</Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <View className="w-6 h-0 border-t border-dashed border-[#3B82F6]" />
            <Text className="text-xs text-gray-500">Ensemble avg</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
