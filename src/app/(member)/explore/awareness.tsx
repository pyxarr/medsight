import { useState } from 'react';
import { Linking, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { HomeHeader } from '@/components/member/HomeHeader';
import { MemberDrawer } from '@/components/member/MemberDrawer';
import { MemberShell } from '@/components/MemberShell';
import { AWARENESS_POSTS, AwarenessPost } from '@/features/explore';

const handleOpenUrl = (url: string) => {
  Linking.openURL(url).catch(() => {});
};

const FeaturedAwarenessCard = ({ post, handleOpenUrl }: { post: AwarenessPost; handleOpenUrl: (url: string) => void }) => (
  <TouchableOpacity
    onPress={() => post.url && handleOpenUrl(post.url)}
    activeOpacity={0.8}
    className="px-5 mb-4"
  >
    <Image
      source={{ uri: post.coverImageUrl }}
      className="w-full h-[220px] rounded-2xl"
      resizeMode="cover"
    />
    <View className="mt-3 gap-2">
      <View className="flex-row items-center gap-2">
        <Text className="text-xs font-medium text-[#DB2777] bg-[#FDF2F8] px-2 py-0.5 rounded-full">
          {post.tag}
        </Text>
      </View>
      <Text className="text-xl font-bold text-gray-900">{post.title}</Text>
      <Text className="text-base text-gray-700 leading-relaxed">{post.body}</Text>
      {post.url && (
        <View className="flex-row items-center gap-2 mt-2 pt-2 border-t border-gray-100">
          <Text className="text-sm font-medium text-[#DB2777]">Read more</Text>
          <Text className="text-gray-500">→</Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

const AwarenessRow = ({ post, handleOpenUrl }: { post: AwarenessPost; handleOpenUrl: (url: string) => void }) => (
  <TouchableOpacity
    key={post.id}
    onPress={() => post.url && handleOpenUrl(post.url)}
    activeOpacity={0.8}
    className="flex-row items-start gap-3 px-5 mb-3"
  >
    <Image
      source={{ uri: post.coverImageUrl }}
      className="w-24 h-24 rounded-xl"
      resizeMode="cover"
    />
    <View className="flex-1 min-w-0">
      <View className="flex-row items-center gap-2 mb-1">
        <Text className="text-xs font-medium text-[#DB2777] bg-[#FDF2F8] px-2 py-0.5 rounded-full">
          {post.tag}
        </Text>
      </View>
      <Text className="text-base font-bold text-gray-900 mb-1" numberOfLines={2}>
        {post.title}
      </Text>
      <Text className="text-sm text-gray-600" numberOfLines={2}>
        {post.body}
      </Text>
    </View>
  </TouchableOpacity>
);

const AwarenessScreen = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const featuredPost = AWARENESS_POSTS[0];
  const otherPosts = AWARENESS_POSTS.slice(1);

  return (
    <View className="flex-1">
      <MemberShell theme="main" showHeader={false}>
        <HomeHeader onHamburgerPress={() => setDrawerVisible(true)} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          keyboardShouldPersistTaps="handled"
        >
          {featuredPost && <FeaturedAwarenessCard post={featuredPost} handleOpenUrl={handleOpenUrl} />}

          <View className="px-5 mb-3">
            <Text className="text-lg font-bold text-gray-900">All Awareness Posts</Text>
          </View>

          {otherPosts.length > 0 ? (
            otherPosts.map((post) => <AwarenessRow key={post.id} post={post} handleOpenUrl={handleOpenUrl} />)
          ) : (
            <View className="px-5 py-12 items-center">
              <Text className="text-gray-500 text-center">No more awareness posts available.</Text>
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

export default AwarenessScreen;