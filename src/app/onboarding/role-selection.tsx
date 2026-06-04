import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";

export default function RoleSelection() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#E6E1FE" }}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <Svg
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <Defs>
          <RadialGradient id="bg" cx="50%" cy="20%" rx="90%" ry="90%">
            <Stop offset="0%" stopColor="#C7D8FD" />
            <Stop offset="25%" stopColor="#F6DFFC" />
            <Stop offset="50%" stopColor="#DCD4FD" />
            <Stop offset="75%" stopColor="#FADEFD" />
            <Stop offset="100%" stopColor="#E6E1FE" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width={width} height={height} fill="url(#bg)" />
      </Svg>

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerClassName="px-5 pb-1 pt-3 gap-3"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center mt-1 mb-4 gap-1">
            <Text className="text-[#111827] text-2xl tracking-[-0.3px]">
              Select Your Role
            </Text>
            <Text className="text-[#111827] text-xl">
              Choose how you&apos;d like to use MedSight
            </Text>
          </View>

          {/* Member card */}
          <View className="bg-white rounded-3xl overflow-hidden p-2 pb-1">
            <Image
              source={require("@/assets/images/onboarding/role-member.png")}
              className="w-full rounded-2xl"
              style={{ height: 260 }}
              resizeMode="cover"
            />
            <View className="px-2 py-3 gap-2">
              <Text className="text-2xl text-slate-900">Member</Text>
              <Text className="text-sm text-slate-600 leading-[21px]">
                Access trusted information and tools to help you better
                understand and support your breast health.
              </Text>
              <View className="mt-2 flex-row items-center justify-center">
                <Pressable
                  className="bg-[#2D5BE3] rounded-lg py-3 px-6 items-center"
                  onPress={() => router.replace("/(auth)/member/sign-in")}
                >
                  <View className="flex-row items-center">
                    <Text className="text-white text-sm font-semibold">
                      Continue as a Member{" "}
                    </Text>

                    <ArrowRight className="ml-1" color="white" />
                  </View>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Clinician card */}
          <View className="bg-white rounded-3xl overflow-hidden p-2 pb-1">
            <Image
              source={require("@/assets/images/onboarding/role-clinician.png")}
              className="w-full rounded-2xl"
              style={{ height: 260 }}
              resizeMode="cover"
            />
            <View className="px-2 py-3 gap-2">
              <Text className="text-2xl text-slate-900">Clinician</Text>
              <Text className="text-sm text-slate-600 leading-[21px]">
                Access tools and insights designed to support informed breast
                health assessment and care.
              </Text>
              <View className="mt-2 flex-row items-center justify-center">
                <Pressable
                  className="mt-1 bg-[#DB2777] rounded-lg py-3 px-6 items-center"
                  onPress={() => router.replace("/(auth)/clinician/sign-in")}
                >
                  <View className="flex-row items-center">
                    <Text className="text-white text-sm font-semibold">
                      Continue as a Clinician{" "}
                    </Text>
                    <ArrowRight className="ml-1" color="white" />
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScrollView>
  );
}