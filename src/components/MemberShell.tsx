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

interface MemberShellProps {
  children: React.ReactNode;
  scrollable?: boolean;
  showHeader?: boolean;
  headerContent?: React.ReactNode;
  theme?: "default" | "main";
}

const GRADIENTS = {
  default: { colors: ["#FEF8F9", "#FFFFFF"] as const, locations: [0, 0.2] as const },
  main: { colors: ["#FDF2F8", "#FFFFFF"] as const, locations: [0, 0.2] as const },
} as const;

export function MemberShell({
  children,
  scrollable = true,
  showHeader = true,
  headerContent,
  theme = "default",
}: MemberShellProps) {
  const defaultHeader = (
    <View className="flex-row items-center gap-2.5 px-5 pt-4 pb-4">
      <Image
        source={require("@/assets/images/logo-1.png")}
        className="w-9 h-9"
      />
      <Text className="text-xl font-semibold">MedSight</Text>
    </View>
  );

  const content = (
    <View style={{ flexGrow: 1, justifyContent: 'center' }}>
      {showHeader && (headerContent ?? defaultHeader)}
      <View style={{ flex: 1, justifyContent: 'center' }}>
        {children}
      </View>
    </View>
  );

  return (
  <LinearGradient colors={GRADIENTS[theme].colors as any} locations={GRADIENTS[theme].locations as any} style={{ flex: 1 }}
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