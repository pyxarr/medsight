import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HomeHeader } from '@/components/member/HomeHeader';
import { MemberDrawer } from '@/components/member/MemberDrawer';
import { MemberShell } from '@/components/MemberShell';
import { FAQS, Faq } from '@/features/explore';

const FaqsScreen = () => {
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

  const FaqCard = ({ faq }: { faq: Faq }) => {
    const isExpanded = expandedIds.has(faq.id);

    return (
      <TouchableOpacity
        onPress={() => toggleExpand(faq.id)}
        activeOpacity={0.8}
        className="px-5 mb-3"
      >
        <View className="bg-white rounded-2xl p-5 border border-gray-100">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-semibold text-gray-900 flex-1 pr-4">
              {faq.question}
            </Text>
            <Ionicons
              name={isExpanded ? 'remove-circle' : 'add-circle'}
              size={24}
              color="#DB2777"
            />
          </View>

          {isExpanded && (
            <>
              <View className="h-px bg-gray-100 my-4" />
              <Text className="text-base text-gray-700 leading-relaxed">{faq.answer}</Text>
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
            <Text className="text-xl font-bold text-gray-900">FAQs</Text>
            <Text className="text-sm text-gray-500 mt-1">
              Tap a question to see the answer.
            </Text>
          </View>

          {FAQS.map((faq) => (
            <View key={faq.id}>
              <FaqCard faq={faq} />
            </View>
          ))}

          {FAQS.length === 0 && (
            <View className="px-5 py-12 items-center">
              <Text className="text-gray-500 text-center">No FAQs available.</Text>
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

export default FaqsScreen;