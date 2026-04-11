import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RoleSelection() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#2563EB]">
      <ScrollView 
        contentContainerClassName="px-5 pb-1 pt-3 gap-4" 
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mb-3 gap-2.5">
          <Text className="text-white text-4xl tracking-[-0.3px]">Select Your Role</Text>
          <Text className="text-white text-base">Choose how you&apos;d like to use MedSight</Text>
        </View>

        {/* Member card */}
        <View className="bg-white rounded-3xl overflow-hidden p-2 pb-1">
          <Image
            source={require('@/assets/images/onboarding/role-member.png')}
            className="w-full h-[180px] rounded-3xl"
            resizeMode="cover"
          />
          <View className="px-2 py-3 gap-2">
            <Text className="text-2xl text-slate-900">Member</Text>
            <Text className="text-sm text-slate-600 leading-[21px]">
              Access trusted information and tools to help you better understand and support your breast health.
            </Text>
            <View className="mt-2 flex-row items-center justify-center">
              <Pressable 
                className="bg-[#2D5BE3] rounded-lg py-3 px-6 items-center" 
                onPress={() => {
                  // TODO: Create member auth screens
                  console.warn('Member auth screens not created yet');
                }}
              >
                <Text className="text-white text-sm font-semibold">Continue as a Member →</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Clinician card */}
        <View className="bg-white rounded-3xl overflow-hidden p-2 pb-1">
          <Image
            source={require('@/assets/images/onboarding/role-clinician.png')}
            className="w-full h-[180px] rounded-3xl"
            resizeMode="cover"
          />
          <View className="px-2 py-3 gap-2">
            <Text className="text-2xl text-slate-900">Clinician</Text>
            <Text className="text-sm text-slate-600 leading-[21px]">
              Access tools and insights designed to support informed breast health assessment and care.
            </Text>
            <View className="mt-2 flex-row items-center justify-center">
            <Pressable 
              className="mt-1 bg-[#2D5BE3] rounded-lg py-3 px-6 items-center" 
              onPress={() => router.replace('/(auth)/clinician/sign-in')}
            >
              <Text className="text-white text-sm font-semibold">Continue as a clinician →</Text>
            </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}