import {
  ScrollView,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

interface ClinicianShellProps {
  children: React.ReactNode;
  scrollable?: boolean;
  showHeader?: boolean;
}

export function ClinicianShell({
  children,
  scrollable = true,
  showHeader = true,
}: ClinicianShellProps) {
  const content = (
    <View style={{ flexGrow: 1, justifyContent: 'center' }}>
      {showHeader && (
        <View className="flex-row items-center gap-2.5 px-5 pt-4 pb-4">
          <Image
            source={require("@/assets/images/logo-1.png")}
            className="w-9 h-9"
          />
          <Text className="text-xl font-semibold">MedSight</Text>
        </View>
      )}
      <View style={{ flex: 1, justifyContent: 'center' }}>
        {children}
      </View>
    </View>
  );

  return (
  <LinearGradient colors={["#E5F1FF", "#FFFFFF"]} locations={[0, 0.2]} style={{ flex: 1 }}
>
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {scrollable ? (
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
          >
            {content}
          </ScrollView>
        ) : (
          content
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  </LinearGradient>
);
}