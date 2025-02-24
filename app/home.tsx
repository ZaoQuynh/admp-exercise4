import React, { useEffect, useState } from 'react';
import { useRouter } from "expo-router";
import { Text, View, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import Button from '@/components/ui/Button';
import useSettings from '@/hooks/useSettings';
import { useAuth } from '../hooks/useAuth';
import Toast from 'react-native-toast-message';
import ToastHelper from '@/utils/ToastHelper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from '@/models/User';
import { Ionicons } from '@expo/vector-icons';
import { translations } from '@/constants/translations';

// Define types for our plant-related data
type EPlantSize = 'SMALL' | 'MEDIUM' | 'LARGE';
type EPlantPurpose = 'INDOOR' | 'OUTDOOR' | 'DECORATION' | 'EDIBLE' | 'MEDICINAL';
type EPlantEnvironment = 'LIVING_ROOM' | 'OFFICE' | 'GARDEN' | 'BALCONY';

interface Plant {
  id: number;
  name: string;
  description: string;
  size: EPlantSize;
  purpose: EPlantPurpose;
  environment: EPlantEnvironment;
  imageUrl: string; // Added for displaying plant images
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  userId: number;
}

interface Product {
  id: number;
  plant: Plant;
  price: number;
  discount: number;
  reviews: Review[];
  isDeleted: boolean;
  imageUrl: string;
}

const bestsellingProducts: Product[] = [
  {
    id: 1, 
    plant: { 
      id: 1, 
      name: 'Peace Lily', 
      description: 'Beautiful flowering indoor plant', 
      size: 'MEDIUM', 
      purpose: 'INDOOR', 
      environment: 'LIVING_ROOM',
      imageUrl: 'https://via.placeholder.com/150'
    },
    price: 29.99,
    discount: 0,
    reviews: [],
    isDeleted: false,
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    id: 2, 
    plant: { 
      id: 2, 
      name: 'Snake Plant', 
      description: 'Low maintenance indoor plant', 
      size: 'MEDIUM', 
      purpose: 'INDOOR', 
      environment: 'OFFICE',
      imageUrl: 'https://via.placeholder.com/150'
    },
    price: 24.99,
    discount: 5,
    reviews: [],
    isDeleted: false,
    imageUrl: 'https://via.placeholder.com/150'
  },
  // Add more dummy data as needed to reach 10 products
  {
    id: 3, 
    plant: { 
      id: 3, 
      name: 'Aloe Vera', 
      description: 'Medicinal plant with healing properties', 
      size: 'SMALL', 
      purpose: 'MEDICINAL', 
      environment: 'LIVING_ROOM',
      imageUrl: 'https://via.placeholder.com/150'
    },
    price: 18.99,
    discount: 0,
    reviews: [],
    isDeleted: false,
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    id: 4, 
    plant: { 
      id: 4, 
      name: 'Lavender', 
      description: 'Fragrant outdoor plant', 
      size: 'SMALL', 
      purpose: 'OUTDOOR', 
      environment: 'GARDEN',
      imageUrl: 'https://via.placeholder.com/150'
    },
    price: 15.99,
    discount: 2,
    reviews: [],
    isDeleted: false,
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    id: 5, 
    plant: { 
      id: 5, 
      name: 'Boston Fern', 
      description: 'Lush green indoor plant', 
      size: 'MEDIUM', 
      purpose: 'INDOOR', 
      environment: 'LIVING_ROOM',
      imageUrl: 'https://via.placeholder.com/150'
    },
    price: 22.99,
    discount: 3,
    reviews: [],
    isDeleted: false,
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    id: 6, 
    plant: { 
      id: 6, 
      name: 'Basil', 
      description: 'Aromatic culinary herb', 
      size: 'SMALL', 
      purpose: 'EDIBLE', 
      environment: 'BALCONY',
      imageUrl: 'https://via.placeholder.com/150'
    },
    price: 9.99,
    discount: 0,
    reviews: [],
    isDeleted: false,
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    id: 7, 
    plant: { 
      id: 7, 
      name: 'Fiddle Leaf Fig', 
      description: 'Trendy large indoor plant', 
      size: 'LARGE', 
      purpose: 'DECORATION', 
      environment: 'LIVING_ROOM',
      imageUrl: 'https://via.placeholder.com/150'
    },
    price: 49.99,
    discount: 10,
    reviews: [],
    isDeleted: false,
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    id: 8, 
    plant: { 
      id: 8, 
      name: 'Mint', 
      description: 'Easy-to-grow culinary herb', 
      size: 'SMALL', 
      purpose: 'EDIBLE', 
      environment: 'BALCONY',
      imageUrl: 'https://via.placeholder.com/150'
    },
    price: 8.99,
    discount: 0,
    reviews: [],
    isDeleted: false,
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    id: 9, 
    plant: { 
      id: 9, 
      name: 'Eucalyptus', 
      description: 'Aromatic medicinal plant', 
      size: 'MEDIUM', 
      purpose: 'MEDICINAL', 
      environment: 'GARDEN',
      imageUrl: 'https://via.placeholder.com/150'
    },
    price: 27.99,
    discount: 5,
    reviews: [],
    isDeleted: false,
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    id: 10, 
    plant: { 
      id: 10, 
      name: 'Orchid', 
      description: 'Elegant flowering plant', 
      size: 'MEDIUM', 
      purpose: 'DECORATION', 
      environment: 'LIVING_ROOM',
      imageUrl: 'https://via.placeholder.com/150'
    },
    price: 34.99,
    discount: 7,
    reviews: [],
    isDeleted: false,
    imageUrl: 'https://via.placeholder.com/150'
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { language, theme, translation, colors } = useSettings();
  const { userInfo } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 1, name: translations[language].indoor, icon: 'home-outline' },
    { id: 2, name: translations[language].outdoor, icon: 'sunny-outline' },
    { id: 3, name: translations[language].decoration, icon: 'flower-outline' },
    { id: 4, name: translations[language].edible, icon: 'nutrition-outline' },
    { id: 5, name: translations[language].medicinal, icon: 'medkit-outline' },
    { id: 6, name: translations[language].small, icon: 'arrow-down-circle-outline' },
    { id: 7, name: translations[language].medium, icon: 'resize-outline' },
    { id: 8, name: translations[language].large, icon: 'arrow-up-circle-outline' },
  ];

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

  const navigateToProfile = () => {
    router.push({
      pathname: "/(profile)/information",
      params: { user: JSON.stringify(user) }
    });
  };

  const navigateToSearch = () => {
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const navigateToProductDetail = (product: Product) => {
    router.push({
      pathname: "/(products)/detail",
      params: { productId: product.id.toString() }
    });
  };

  const navigateToCategory = (categoryId: number) => {
    router.push({
      pathname: "/(products)/category",
      params: { categoryId: categoryId.toString() }
    });
  };

  const navigateToCart = () => {
    router.push("/(cart)/view");
  };

  const navigateToFavorites = () => {
    router.push("/(favorites)/view");
  };

  const navigateToNotifications = () => {
    router.push("/(notifications)/view");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar with Search and User Profile */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text2} />
        </TouchableOpacity>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.placeholder} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={translation.search || "Search plants..."}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={navigateToSearch}
            placeholderTextColor={colors.placeholder}
          />
        </View>

        <Button
          title=''
          onPress={navigateToProfile}
          color="#fff"
          textColor="#fff"
          icon={require('../assets/images/notification-icon.png')}
          style={styles.circleButton}
        />
        
        <Button
          title=''
          onPress={navigateToProfile}
          color="#fff"
          textColor="#fff"
          icon={user?.avatar || require('../assets/images/temp-user.png')}
          style={styles.circleButton}
        />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.welcomeSection}>
          <Text style={[styles.welcomeText, { color: colors.text3 }]}>
            {translation.hello || 'Hello'}, {user?.fullName || translation.guest || 'Guest'}!
          </Text>
          <Text style={[styles.subtitleText, { color: colors.text2 }]}>
            {translation.findYourPlant || 'Find your perfect plant today'}
          </Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text2 }]}>
            {translation.categories || 'Categories'}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryItem}
                onPress={() => navigateToCategory(category.id)}
              >
                <View style={[styles.categoryIcon, { backgroundColor: colors.background }]}>
                  <Ionicons name={category.icon as any} size={28} color={colors.text2} />
                </View>
                <Text style={[styles.categoryName, { color: colors.text2 }]}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text2 }]}>
            {translation.bestselling || 'Bestselling Plants'}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsContainer}>
            {bestsellingProducts.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.productItem}
                onPress={() => navigateToProductDetail(product)}
              >
                <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text style={[styles.productName, { color: colors.text2 }]} numberOfLines={1}>
                    {product.plant.name}
                  </Text>
                  <View style={styles.priceContainer}>
                    {product.discount > 0 ? (
                      <>
                        <Text style={[styles.discountedPrice, { color: colors.primary }]}>
                          ${(product.price - product.discount).toFixed(2)}
                        </Text>
                        <Text style={styles.originalPrice}>
                          ${product.price.toFixed(2)}
                        </Text>
                      </>
                    ) : (
                      <Text style={[styles.price, { color: colors.primary }]}>
                        ${product.price.toFixed(2)}
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

      </ScrollView>

      <View style={[styles.bottomNavigation, { backgroundColor: colors.background }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => {}}>
          <Ionicons name="home" size={24} color={colors.primary} />
          <Text style={[styles.navText, { color: colors.primary }]}>
            {translation.home || 'Home'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigateToCategory(0)}>
          <Ionicons name="grid-outline" size={24} color={colors.text3} />
          <Text style={[styles.navText, { color: colors.text3 }]}>
            {translation.explore || 'Explore'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={navigateToCart}>
          <Ionicons name="cart-outline" size={24} color={colors.text3} />
          <Text style={[styles.navText, { color: colors.text3 }]}>
            {translation.cart || 'Cart'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={navigateToFavorites}>
          <Ionicons name="heart-outline" size={24} color={colors.text3} />
          <Text style={[styles.navText, { color: colors.text3 }]}>
            {translation.favorites || 'Favorites'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={navigateToProfile}>
          <Ionicons name="person-outline" size={24} color={colors.text3} />
          <Text style={[styles.navText, { color: colors.text3 }]}>
            {translation.profile || 'Profile'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* <Toast /> */}
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
  },
});