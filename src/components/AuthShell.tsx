import { useRef } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AuthShellProps {
  children: React.ReactNode;
  scrollable?: boolean;
  showBackButton?: boolean;
  scrollRef?: React.RefObject<ScrollView | null>;
  role?: "member" | "clinician";
}

export function AuthShell({
  children,
  scrollable = true,
  showBackButton = false,
  scrollRef,
  role = "clinician",
}: AuthShellProps) {
  const router = useRouter();
  const internalScrollRef = useRef<ScrollView>(null);

  const activeScrollRef = scrollRef || internalScrollRef;

  const content = (
    <View style={{ flexGrow: 1 }} className="pt-4">
      {/* Top-left logo */}
      <View className="flex-row items-center gap-2.5 mb-6 px-5 pt-2">
        <Image
          source={role === "clinician" ? require("@/assets/images/logo-1.png") : require("@/assets/images/logo-2.png")}
          className="w-9 h-9"
        />
        <Text className="text-xl font-semibold">MedSight</Text>
      </View>

      {/* Back Button */}
      {showBackButton && (
        <TouchableOpacity
          className="mx-5 w-12 h-12 rounded-full bg-white items-center justify-center shadow-md mb-2"
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="black" />
        </TouchableOpacity>
      )}

      {/* Card */}
      <View style={{ flexGrow: 1, justifyContent: "center" }} className="pt-4">
        <View className="bg-white rounded-3xl px-5 mx-4 mb-2 pt-8 pb-6">
          {children}
        </View>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={[`${role === "clinician" ? "#E5F1FF" : "#FDF3F8"}`, "#FFFFFF"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={["bottom", "top"]}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {scrollable ? (
              <ScrollView
                ref={activeScrollRef}
                contentContainerStyle={{
                  flexGrow: 1,
                  paddingBottom: 20,
                }}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                showsVerticalScrollIndicator={false}
              >
                {content}
              </ScrollView>
            ) : (
              content
            )}
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}