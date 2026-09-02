import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { HomeHeader } from '@/components/member/HomeHeader';
import { MemberDrawer } from '@/components/member/MemberDrawer';
import { MemberShell } from '@/components/MemberShell';
import { MYTH_FACTS, MythFact } from '@/features/explore';

const MythVsFactsScreen = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const MythFactCard = ({ mythFact }: { mythFact: MythFact }) => {
    const isExpanded = expandedIds.has(mythFact.id);

    return (
      <TouchableOpacity
        onPress={() => toggleExpand(mythFact.id)}
        activeOpacity={0.8}
        className="px-5 mb-3"
      >
        <View className="bg-white rounded-2xl p-5 border border-gray-100">
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1">
              <View className="flex-row items-center gap-2 mb-2">
                <Text className="text-xs font-semibold text-[#DC2626] bg-[#FEE2E2] px-2 py-0.5 rounded-full">
                  Myth
                </Text>
              </View>
              <Text className="text-base font-semibold text-gray-900">{mythFact.myth}</Text>
            </View>
            <View className="flex-shrink-0">
              <Text className="text-sm font-medium text-gray-500">
                {isExpanded ? 'Hide' : 'Show'}
              </Text>
            </View>
          </View>

          {isExpanded && (
            <>
              <View className="h-px bg-gray-100 my-4" />
              <View>
                <View className="flex-row items-center gap-2 mb-2">
                  <Text className="text-xs font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                    Fact
                  </Text>
                </View>
                <Text className="text-base text-gray-700 leading-relaxed">{mythFact.fact}</Text>
              </View>
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1">
      <MemberShell theme="main" showHeader={false}>
        <HomeHeader onHamburgerPress={() => setDrawerVisible(true)} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-5 mb-4">
            <Text className="text-xl font-bold text-gray-900">Myth vs Facts</Text>
            <Text className="text-sm text-gray-500 mt-1">
              Tap each myth to reveal the fact.
            </Text>
          </View>

          {MYTH_FACTS.map((mythFact) => (
            <View key={mythFact.id}>
              <MythFactCard mythFact={mythFact} />
            </View>
          ))}

          {MYTH_FACTS.length === 0 && (
            <View className="px-5 py-12 items-center">
              <Text className="text-gray-500 text-center">No myths available.</Text>
            </View>
          )}
        </ScrollView>
      </MemberShell>
      <MemberDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </View>
  );
};

export default MythVsFactsScreen;