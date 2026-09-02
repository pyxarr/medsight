import { useState } from 'react';
import { Linking, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HomeHeader } from '@/components/member/HomeHeader';
import { MemberDrawer } from '@/components/member/MemberDrawer';
import { MemberShell } from '@/components/MemberShell';
import { VIDEOS, Video } from '@/features/explore';

const handleOpenUrl = (url: string) => {
  Linking.openURL(url).catch(() => {});
};

const FeaturedVideoCard = ({ video, handleOpenUrl }: { video: Video; handleOpenUrl: (url: string) => void }) => (
  <TouchableOpacity
    onPress={() => handleOpenUrl(video.url)}
    activeOpacity={0.8}
    className="px-5 mb-4"
  >
    <View className="relative w-full h-[200px] rounded-2xl overflow-hidden">
      <Image
        source={{ uri: video.thumbnailUrl }}
        className="w-full h-full"
        resizeMode="cover"
      />
      <View className="absolute inset-0 bg-black/30 items-center justify-center">
        <Ionicons name="play-circle" size={60} color="#FFFFFF" />
      </View>
    </View>
    <View className="mt-3 gap-1">
      <Text className="text-xs text-gray-500 uppercase tracking-wider">{video.source}</Text>
      <Text className="text-xl font-bold text-gray-900" numberOfLines={2}>
        {video.title}
      </Text>
      <Text className="text-sm text-gray-600" numberOfLines={2}>
        {video.excerpt}
      </Text>
    </View>
  </TouchableOpacity>
);

const VideoRow = ({ video, handleOpenUrl }: { video: Video; handleOpenUrl: (url: string) => void }) => (
  <TouchableOpacity
    key={video.id}
    onPress={() => handleOpenUrl(video.url)}
    activeOpacity={0.8}
    className="flex-row items-start gap-3 px-5 mb-3"
  >
    <View className="relative w-[160px] h-[90px] rounded-xl overflow-hidden flex-shrink-0">
      <Image
        source={{ uri: video.thumbnailUrl }}
        className="w-full h-full"
        resizeMode="cover"
      />
      <View className="absolute inset-0 bg-black/30 items-center justify-center">
        <Ionicons name="play-circle" size={40} color="#FFFFFF" />
      </View>
    </View>
    <View className="flex-1 min-w-0">
      <Text className="text-xs text-gray-500 uppercase tracking-wider mb-1">{video.source}</Text>
      <Text className="text-base font-bold text-gray-900 mb-1" numberOfLines={2}>
        {video.title}
      </Text>
      <Text className="text-sm text-gray-600" numberOfLines={2}>
        {video.excerpt}
      </Text>
    </View>
  </TouchableOpacity>
);

const VideosScreen = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const featuredVideo = VIDEOS.find((v) => v.isFeatured);
  const otherVideos = VIDEOS.filter((v) => !v.isFeatured);

  return (
    <View className="flex-1">
      <MemberShell theme="main" showHeader={false}>
        <HomeHeader onHamburgerPress={() => setDrawerVisible(true)} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          keyboardShouldPersistTaps="handled"
        >
          {featuredVideo && <FeaturedVideoCard video={featuredVideo} handleOpenUrl={handleOpenUrl} />}

          <View className="px-5 mb-3">
            <Text className="text-lg font-bold text-gray-900">All Videos</Text>
          </View>

          {otherVideos.length > 0 ? (
            otherVideos.map((video) => <VideoRow key={video.id} video={video} handleOpenUrl={handleOpenUrl} />)
          ) : (
            <View className="px-5 py-12 items-center">
              <Text className="text-gray-500 text-center">No more videos available.</Text>
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

export default VideosScreen;