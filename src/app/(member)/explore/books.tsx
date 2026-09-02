import { useState } from 'react';
import { Linking, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { HomeHeader } from '@/components/member/HomeHeader';
import { MemberDrawer } from '@/components/member/MemberDrawer';
import { MemberShell } from '@/components/MemberShell';
import { BOOKS, Book } from '@/features/explore';

const handleOpenUrl = (url: string) => {
  Linking.openURL(url).catch(() => {});
};

const FeaturedBookCard = ({ book, handleOpenUrl }: { book: Book; handleOpenUrl: (url: string) => void }) => (
  <TouchableOpacity
    onPress={() => handleOpenUrl(book.url)}
    activeOpacity={0.8}
    className="px-5 mb-4"
  >
    <View className="flex-row gap-4 bg-white rounded-2xl p-4">
      <Image
        source={{ uri: book.coverImageUrl }}
        className="w-[120px] h-[165px] rounded-lg"
        resizeMode="cover"
      />
      <View className="flex-1 justify-center">
        <Text className="text-xl font-bold text-gray-900 mb-1">{book.title}</Text>
        <Text className="text-base text-gray-600 mb-2">by {book.author}</Text>
        <View className="flex-row items-center gap-2">
          <Text className="text-sm font-medium text-[#DB2777]">Read on Amazon</Text>
          <Text className="text-gray-500">→</Text>
        </View>
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

const BooksScreen = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const featuredBook = BOOKS[0];
  const otherBooks = BOOKS.slice(1);

  return (
    <View className="flex-1">
      <MemberShell theme="main" showHeader={false}>
        <HomeHeader onHamburgerPress={() => setDrawerVisible(true)} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          keyboardShouldPersistTaps="handled"
        >
          {featuredBook && <FeaturedBookCard book={featuredBook} handleOpenUrl={handleOpenUrl} />}

          <View className="px-5 mb-3">
            <Text className="text-lg font-bold text-gray-900">All Books</Text>
          </View>

          {otherBooks.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 5, paddingRight: 5 }}
            >
              {otherBooks.map((book) => <BookCard key={book.id} book={book} handleOpenUrl={handleOpenUrl} />)}
            </ScrollView>
          ) : (
            <View className="px-5 py-12 items-center">
              <Text className="text-gray-500 text-center">No more books available.</Text>
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

export default BooksScreen;