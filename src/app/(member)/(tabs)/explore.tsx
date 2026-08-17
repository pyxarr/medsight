import { useState } from "react";
import { View, Text } from "react-native";
import { HomeHeader } from "@/components/member/HomeHeader";
import { MemberDrawer } from "@/components/member/MemberDrawer";
import { MemberShell } from "@/components/MemberShell";

const Explore = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <View className="flex-1">
      <MemberShell theme="main" showHeader={false}>
        {/* <HomeHeader onHamburgerPress={() => setDrawerVisible(true)} /> */}
        <View>
          <Text>explore</Text>
        </View>
      </MemberShell>
      <MemberDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </View>
  );
};

export default Explore;
