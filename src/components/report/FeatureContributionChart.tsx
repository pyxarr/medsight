import { View, Text, useWindowDimensions } from "react-native";
import { Svg, Rect, Text as SvgText, Line } from "react-native-svg";
import type { RiskDriver } from "@/types/report";

interface FeatureContributionChartProps {
  drivers: RiskDriver[];
}

const LABEL_AREA_WIDTH = 45;
const BAR_HEIGHT = 22;
const ROW_HEIGHT = 40;
const AXIS_COLOUR = "#6B7280";
const X_AXIS_LABELS = [-40, -20, 0, 20, 40];
const ZERO_LINE_RATIO = 0.5;

function truncateName(name: string, maxLen: number): string {
  return name.length > maxLen ? `${name.slice(0, maxLen)}…` : name;
}

export function FeatureContributionChart({ drivers }: FeatureContributionChartProps) {
  const { width: screenWidth } = useWindowDimensions();

  if (drivers.length === 0) return null;

  const maxContribution = Math.max(...drivers.map((d) => Math.abs(d.contribution)), 1);
  const cardContentWidth = screenWidth - 72;
  const chartWidth = cardContentWidth - LABEL_AREA_WIDTH;
  const X_AXIS_PADDING = 14;
  const effectiveWidth = chartWidth - X_AXIS_PADDING * 2;
  const zeroLineX = effectiveWidth * ZERO_LINE_RATIO;
  const leftSpace = zeroLineX;
  const rightSpace = effectiveWidth - zeroLineX;
  const chartHeight = drivers.length * ROW_HEIGHT;

  return (
    <View className="mx-5">
      {/* Section header */}
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
          Feature Contribution (SHAP Values)
        </Text>
        <View className="w-5 h-5 rounded-full border border-gray-300 items-center justify-center">
          <Text className="text-xs text-gray-400 italic">i</Text>
        </View>
      </View>

      {/* Chart card */}
      <View className="bg-white rounded-2xl border border-gray-100 p-4 px-1 shadow-sm">
        {/* Two-column: label SVG + chart SVG */}
        <View style={{ flexDirection: "row", paddingHorizontal: X_AXIS_PADDING }}>
          {/* Label SVG with native-like text + tick marks */}
          <Svg width={LABEL_AREA_WIDTH} height={chartHeight}>
            {drivers.map((driver, index) => {
              const labelY = index * ROW_HEIGHT + ROW_HEIGHT / 2 + 4;
              return (
                <SvgText
                  key={`label-${index}`}
                  x={LABEL_AREA_WIDTH - 8}
                  y={labelY}
                  textAnchor="end"
                  fontSize={11}
                  fill="#4B5563"
                >
                  {truncateName(driver.featureName, 4)}
                </SvgText>
              );
            })}

            {/* Tick marks from label edge to Y-axis boundary */}
            {drivers.map((_, index) => {
              const y = index * ROW_HEIGHT + ROW_HEIGHT / 1.7;
              return (
                <Line
                  key={`tick-${index}`}
                  x1={LABEL_AREA_WIDTH - 8}
                  y1={y}
                  x2={LABEL_AREA_WIDTH}
                  y2={y}
                  stroke={AXIS_COLOUR}
                  strokeWidth={1}
                />
              );
            })}
          </Svg>

          {/* Chart SVG */}
          <Svg width={effectiveWidth} height={chartHeight + 6}>
            {/* Bars — diverge from 0% line */}
            {drivers.map((driver, index) => {
              const maxBarWidth = driver.direction === "decreases_risk" ? leftSpace : rightSpace;
              const barPixelWidth = (Math.abs(driver.contribution) / maxContribution) * maxBarWidth;
              const barY = index * ROW_HEIGHT + (ROW_HEIGHT - BAR_HEIGHT) / 2;

              if (driver.direction === "increases_risk") {
                return (
                  <Rect
                    key={`bar-${index}`}
                    x={zeroLineX}
                    y={barY}
                    width={barPixelWidth}
                    height={BAR_HEIGHT}
                    fill="#EF4444"
                    rx={4}
                  />
                );
              }

              return (
                <Rect
                  key={`bar-${index}`}
                  x={zeroLineX - barPixelWidth}
                  y={barY}
                  width={barPixelWidth}
                  height={BAR_HEIGHT}
                  fill="#22C55E"
                  rx={4}
                />
              );
            })}

            {/* 0% line — where bars diverge from */}
            <Line x1={zeroLineX} y1={0} x2={zeroLineX} y2={chartHeight} stroke={AXIS_COLOUR} strokeWidth={1} strokeDasharray="4 3" />

            {/* Y-axis — vertical line at left edge (-40%) */}
            <Line x1={0} y1={0} x2={0} y2={chartHeight + 6} stroke={AXIS_COLOUR} strokeWidth={1.5} />
          </Svg>
        </View>

        {/* X-axis line + labels */}
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: LABEL_AREA_WIDTH }} />
          <Svg width={chartWidth} height={34}>
            <Line x1={X_AXIS_PADDING} y1={0} x2={chartWidth - X_AXIS_PADDING} y2={0} stroke={AXIS_COLOUR} strokeWidth={1.5} />
            {/* Tick marks below axis line toward labels */}
            {X_AXIS_LABELS.map((pct) => {
              const ratio = (pct + 40) / 80;
              const x = X_AXIS_PADDING + ratio * (chartWidth - X_AXIS_PADDING * 2);
              return (
                <Line
                  key={`xtick-${pct}`}
                  x1={x}
                  y1={0}
                  x2={x}
                  y2={6}
                  stroke={AXIS_COLOUR}
                  strokeWidth={1}
                />
              );
            })}
            {X_AXIS_LABELS.map((pct) => {
              const X_AXIS_PADDING = 14;
              const ratio = (pct + 40) / 80;
              const x = X_AXIS_PADDING + ratio * (chartWidth - X_AXIS_PADDING * 2);
              return (
                <SvgText key={pct} x={x} y={24} textAnchor="middle" fontSize={10} fill="#6B7280" fontWeight="500">
                  {`${pct}%`}
                </SvgText>
              );
            })}
          </Svg>
        </View>

        {/* Legend */}
        <View className="flex-row items-center justify-center gap-6 mt-3">
          <View className="flex-row items-center gap-1.5">
            <View className="w-3 h-3 rounded-full bg-[#22C55E]" />
            <Text className="text-xs text-gray-500">Decreases Risk</Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <View className="w-3 h-3 rounded-full bg-[#EF4444]" />
            <Text className="text-xs text-gray-500">Increases Risk</Text>
          </View>
        </View>

        {/* Footer */}
        <Text className="text-xs text-gray-400 italic mt-2 text-center">
          Model contribution only — not causal inference
        </Text>
      </View>
    </View>
  );
}
