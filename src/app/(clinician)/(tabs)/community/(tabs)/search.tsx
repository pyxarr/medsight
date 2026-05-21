import { useState, useMemo, useCallback, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { ClinicianShell } from "@/components/ClinicianShell";
import { CommunitySearchBar } from "@/components/clinician/community/CommunitySearchBar";

type CommunityTabParamList = {
  index: undefined;
  search: undefined;
  chat: undefined;
};

type NavigationProp = BottomTabNavigationProp<CommunityTabParamList, "search">;

const RECENT_SEARCHES = ["@tnsal", "@mary014", "@its ola", "@tnsal"];

export default function CommunitySearch() {
  const navigation = useNavigation<NavigationProp>();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (isFocused) {
      navigation.setOptions({
        tabBarStyle: { display: "none" },
      });
    } else {
      navigation.setOptions({
        tabBarStyle: undefined,
      });
    }
  }, [isFocused, navigation]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    if (query.trim() === "") {
      setIsFocused(false);
    }
  }, [query]);

  const filteredSearches = useMemo(() => {
    if (!query.trim()) return RECENT_SEARCHES;
    return RECENT_SEARCHES.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <ClinicianShell showHeader={false} scrollable={false}>
      <View className="flex-1 pt-4">
        <CommunitySearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search"
        />

        {query.trim() === "" && (
          <View className="flex-1 px-5">
            <Text className="text-sm font-semibold text-gray-900 mb-3">Recent Searches</Text>
            <FlatList
              data={filteredSearches}
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity className="py-2.5 border-b border-gray-100" activeOpacity={0.7}>
                  <Text className="text-sm text-gray-600">{item}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </View>
    </ClinicianShell>
  );
}
