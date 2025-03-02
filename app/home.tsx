import React, { useEffect, useState } from 'react';
import { useRouter } from "expo-router";
import { Text, View, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, TextStyle } from 'react-native';
import Header from '@/components/ui/Header';
import CategoryList from '@/components/ui/CategoryList';
import BestsellingProducts from '@/components/ui/BestsellingProducts';
import BottomNavigation from '@/components/ui/BottomNavigation';
import useSettings from '@/hooks/useSettings';
import { useAuth } from '@/hooks/useAuth';
import { useAttribute } from '@/hooks/useAttribute';
import ToastHelper from '@/utils/ToastHelper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from '@/models/User';
import { Attribute } from '@/models/Attribute';
import { Product } from '@/models/Product';
import { translations } from '@/constants/translations';
import { useProduct } from '@/hooks/useProduct';
import ProductList from '@/components/ui/ProductList';

export default function HomeScreen() {
  const router = useRouter();
  const { language, theme, translation, colors } = useSettings();
  const { userInfo } = useAuth();
  const { handleGetAttributes } = useAttribute();
  const { handleGetProducts } = useProduct();
  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Attribute[] | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const textStyleH1v1: TextStyle = {
    fontWeight: 'bold',
    color: colors.text2,
  };
  
  const textStyleH1v2: TextStyle = {
    fontWeight: 'bold',
    color: colors.text3,
  };

  const textStyle: TextStyle = {
    color: colors.text2,
  };

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const attributes = await handleGetAttributes(); 
        setCategories(attributes);
      } catch (error) {
        console.error("Error fetching attributes:", error);
      }
    };
  
    fetchAttributes();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const attributes = await handleGetProducts(); 
        setProducts(attributes);
      } catch (error) {
        console.error("Error fetching attributes:", error);
      }
    };
  
    fetchProducts();
  }, []);

  useEffect(() => {
    userInfo()
      .then((theUser) => {
        if (theUser?.fullName) {
          setUser(theUser);
          ToastHelper.showSuccess(
            translation.loginSuccess || 'Login Success',
            translation.welcomeBack + (theUser.fullName || 'User')
          );
        }
      })
      .catch((error) => {
        router.replace("/(auth)/login");
      });
  }, [userInfo, translation]);

  return (
    <SafeAreaView style={[styles.container]}>
      <Header 
        user={user}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        colors={colors}
        translation={translation}
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.welcomeSection}>
          <View>
          <Text style={[styles.welcomeText, { color: colors.text3 }, textStyleH1v1]}>
            {translation.hello || 'Hello'},
          </Text>
          <Text style={[styles.welcomeText, { color: colors.text3 }, textStyleH1v2]}>
            {user?.fullName || translation.guest || 'Guest'}!
          </Text>
          </View>
          <Text style={[styles.subtitleText, { color: colors.text2 }, textStyle]}>
            {translation.findYourPlant || 'Find your perfect plant today'}
          </Text>
        </View>

        <CategoryList 
          categories={categories || []}
          colors={colors}
          translation={translation}
          language={language}
          textStyle={textStyle}
        />

        <BestsellingProducts 
          products={products || []}
          colors={colors}
          translation={translation}
        />

        <ProductList
          products={products || []}
          colors={colors}
          translation={translation}
          // categoryId={selectedCategory} // Tùy chọn
          searchQuery={searchQuery} // Tùy chọn
        />
      </ScrollView>

      <BottomNavigation 
        colors={colors}
        translation={translation}
        textStyle={textStyle}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 2,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    marginRight: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginHorizontal: 8,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    padding: 0,
  },
  circleButton: {
    width: 40,
    height: 40,
    marginLeft: 8,
    padding: 0,
    paddingLeft: 25,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
  },
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 70,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
  },
  productsContainer: {
    marginBottom: 24,
  },
  productItem: {
    width: 160,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: '100%',
    height: 160,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  discountedPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
  }
});