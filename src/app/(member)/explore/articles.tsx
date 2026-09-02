import { useState } from 'react';
import { Linking, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { HomeHeader } from '@/components/member/HomeHeader';
import { MemberDrawer } from '@/components/member/MemberDrawer';
import { MemberShell } from '@/components/MemberShell';
import { ARTICLES, Article } from '@/features/explore';

const handleOpenUrl = (url: string) => {
  Linking.openURL(url).catch(() => {});
};

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

const ArticlesScreen = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const featuredArticle = ARTICLES.find((a) => a.isFeatured);
  const otherArticles = ARTICLES.filter((a) => !a.isFeatured);

  return (
    <View className="flex-1">
      <MemberShell theme="main" showHeader={false}>
        <HomeHeader onHamburgerPress={() => setDrawerVisible(true)} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          keyboardShouldPersistTaps="handled"
        >
          {featuredArticle && <FeaturedArticleCard article={featuredArticle} handleOpenUrl={handleOpenUrl} />}

          <View className="px-5 mb-3">
            <Text className="text-lg font-bold text-gray-900">All Articles</Text>
          </View>

          {otherArticles.length > 0 ? (
            otherArticles.map((article) => <ArticleRow key={article.id} article={article} handleOpenUrl={handleOpenUrl} />)
          ) : (
            <View className="px-5 py-12 items-center">
              <Text className="text-gray-500 text-center">No more articles available.</Text>
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

export default ArticlesScreen;