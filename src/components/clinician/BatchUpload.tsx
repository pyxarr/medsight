import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function BatchUpload() {
  return (
    <View className="flex-1 px-5">
      {/* Upload Card */}
      <View className="bg-[#EFF6FF] border border-dashed border-[#93C5FD] rounded-3xl p-8 items-center mb-4">
        <View className="w-20 h-20 rounded-full bg-blue-100 items-center justify-center mb-5">
          <Ionicons name="share-outline" size={32} color="#2563EB" />
        </View>
        <Text className="text-xl font-semibold text-gray-900 mb-2">
          Upload patient data
        </Text>
        <Text className="text-sm text-gray-500 text-center mb-6">
          Upload batch data (Clinical, Biopsy & Blood models supported)
        </Text>
        <TouchableOpacity className="flex-row items-center gap-2 bg-blue-600 px-6 py-3 rounded-md mb-3">
          <Ionicons name="document-text-outline" size={18} color="white" />
          <Text className="text-white font-semibold">Select CSV file</Text>
        </TouchableOpacity>
        <Text className="text-sm text-gray-400">
          Download template{" "}
          <Text className="text-blue-600 underline">here</Text>
        </Text>
        <Text className="text-xs text-gray-400 mt-8">
          Supported format: CSV with standard tumor feature columns
        </Text>
      </View>

      {/* Disclaimer */}
      <View className="bg-yellow-50 border border-yellow-200 rounded-2xl px-4 py-3">
        <Text className="text-sm">
          <Text className="font-bold text-red-600">
            This tool provides clinical decision support only —{" "}
          </Text>
          <Text className="text-gray-600">
            it does not provide diagnosis or replace professional medical
            judgment...
          </Text>
          <Text className="text-blue-600"> More</Text>
        </Text>
      </View>
    </View>
  );
}