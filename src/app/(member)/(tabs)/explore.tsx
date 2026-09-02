import { useState } from 'react';
import { Linking, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { HomeHeader } from '@/components/member/HomeHeader';
import { MemberDrawer } from '@/components/member/MemberDrawer';
import { MemberShell } from '@/components/MemberShell';
import {
  ARTICLES,
  BOOKS,
  VIDEOS,
  AWARENESS_POSTS,
  Article,
  Book,
  Video,
  AwarenessPost,
} from '@/features/explore';

const handleOpenUrl = (url: string) => {
  Linking.openURL(url).catch(() => {});
};

const SectionHeader = ({ title, onSeeAll }: { title: string; onSeeAll?: () => void }) => (
  <View className="flex-row items-center justify-between px-5 mb-3">
    <Text className="text-lg font-bold text-gray-900">{title}</Text>
    {onSeeAll && (
      <TouchableOpacity onPress={onSeeAll} activeOpacity={0.7}>
        <Text className="text-sm font-medium text-[#DB2777]">See all</Text>
      </TouchableOpacity>
    )}
  </View>
);

const ArticleRow = ({ article, handleOpenUrl }: { article: Article; handleOpenUrl: (url: string) => void }) => (
  <TouchableOpacity
    key={article.id}
    onPress={() => handleOpenUrl(article.url)}
    activeOpacity={0.8}
    className="flex-row items-start gap-3 px-5 mb-3"
  >
    <View className="flex-1 min-w-0">
      <Text className="text-xs text-gray-500 uppercase tracking-wider mb-1">{article.source}</Text>
      <Text className="text-base font-bold text-gray-900 mb-1" numberOfLines={2}>
        {article.title}
      </Text>
      <Text className="text-sm text-gray-600 mb-1" numberOfLines={2}>
        {article.excerpt}
      </Text>
      <View className="flex-row items-center gap-2 text-xs text-gray-400">
        <Text>{article.date}</Text>
        {article.author && (
          <>
            <Text>•</Text>
            <Text>{article.author}</Text>
          </>
        )}
      </View>
    </View>
    <Image
      source={{ uri: article.coverImageUrl }}
      className="w-24 h-24 rounded-xl"
      resizeMode="cover"
    />
  </TouchableOpacity>
);

const FeaturedArticleCard = ({ article, handleOpenUrl }: { article: Article; handleOpenUrl: (url: string) => void }) => (
  <TouchableOpacity
    onPress={() => handleOpenUrl(article.url)}
    activeOpacity={0.8}
    className="px-5 mb-4"
  >
    <Image
      source={{ uri: article.coverImageUrl }}
      className="w-full h-[220px] rounded-2xl"
      resizeMode="cover"
    />
    <View className="mt-3 gap-1">
      <Text className="text-xs text-gray-500 uppercase tracking-wider">{article.source}</Text>
      <Text className="text-xl font-bold text-gray-900" numberOfLines={2}>
        {article.title}
      </Text>
      <Text className="text-sm text-gray-600" numberOfLines={2}>
        {article.excerpt}
      </Text>
      <View className="flex-row items-center gap-2 text-xs text-gray-400 mt-1">
        <Text>{article.date}</Text>
        {article.author && (
          <>
            <Text>•</Text>
            <Text>{article.author}</Text>
          </>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

const BookCard = ({ book, handleOpenUrl }: { book: Book; handleOpenUrl: (url: string) => void }) => (
  <TouchableOpacity
    key={book.id}
    onPress={() => handleOpenUrl(book.url)}
    activeOpacity={0.8}
    className="mr-3"
  >
    <View className="w-[110px]">
      <Image
        source={{ uri: book.coverImageUrl }}
        className="w-[110px] h-[150px] rounded-lg"
        resizeMode="cover"
      />
      <Text className="text-sm font-semibold text-gray-900 mt-2" numberOfLines={2}>
        {book.title}
      </Text>
      <Text className="text-xs text-gray-500">{book.author}</Text>
    </View>
  </TouchableOpacity>
);

const AwarenessCard = ({ post, handleOpenUrl }: { post: AwarenessPost; handleOpenUrl: (url: string) => void }) => (
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

const ExploreTab = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const featuredArticle = ARTICLES.find((a) => a.isFeatured);
  const otherArticles = ARTICLES.filter((a) => !a.isFeatured);
  const featuredVideo = VIDEOS.find((v) => v.isFeatured);
  const awarenessPosts = AWARENESS_POSTS.slice(0, 2);

  return (
    <View className="flex-1">
      <MemberShell theme="main" showHeader={false}>
        <HomeHeader onHamburgerPress={() => setDrawerVisible(true)} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* 1. Featured Article */}
          {featuredArticle && <FeaturedArticleCard article={featuredArticle} handleOpenUrl={handleOpenUrl} />}

          {/* 2. More Articles */}
          {otherArticles.length > 0 && (
            <>
              <SectionHeader
                title="More Articles"
                onSeeAll={() => router.push('../explore/articles')}
              />
              {otherArticles.map((article) => <ArticleRow key={article.id} article={article} handleOpenUrl={handleOpenUrl} />)}
            </>
          )}

          {/* 3. Books */}
          {BOOKS.length > 0 && (
            <>
              <SectionHeader
                title="Books"
                onSeeAll={() => router.push('../explore/books')}
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 5, paddingRight: 5 }}
              >
                {BOOKS.map((book) => <BookCard key={book.id} book={book} handleOpenUrl={handleOpenUrl} />)}
              </ScrollView>
            </>
          )}

          {/* 4. Awareness */}
          {awarenessPosts.length > 0 && (
            <>
              <SectionHeader
                title="Awareness"
                onSeeAll={() => router.push('../explore/awareness')}
              />
              {awarenessPosts.map((post) => <AwarenessCard key={post.id} post={post} handleOpenUrl={handleOpenUrl} />)}
            </>
          )}

          {/* 5. Videos */}
          {featuredVideo && (
            <>
              <SectionHeader
                title="Videos"
                onSeeAll={() => router.push('../explore/videos')}
              />
              <FeaturedVideoCard video={featuredVideo} handleOpenUrl={handleOpenUrl} />
            </>
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

export default ExploreTab;