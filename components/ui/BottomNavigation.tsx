import React from 'react';
import { Colors } from '@/constants/Colors';
import { View, TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface BottomNavigationProps {
  colors: any;
  translation: any;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  colors,
  translation,
  style,
  textStyle,
}) => {
  const router = useRouter();

  const navigateToHome = () => router.push("/home");
  const navigateToCart = () => router.push("/(cart)/view");
  const navigateToFavorites = () => router.push("/(favorites)/view");
  const navigateToProfile = () => router.push("/(profile)/information");
  const navigateToCategory = () => router.push({ pathname: "/(products)/category", params: { categoryId: "0" } });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }, style]}>
      <TouchableOpacity style={styles.navItem} onPress={navigateToHome}>
        <Ionicons name="home" size={24} color={colors.primary} />
        <Text style={[styles.navText, { color: colors.primary }, textStyle]}>
          {translation.home || 'Home'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.navItem} onPress={navigateToCategory}>
        <Ionicons name="grid-outline" size={24} color={colors.text3} />
        <Text style={[styles.navText, { color: colors.text3 }, textStyle]}>
          {translation.explore || 'Explore'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.navItem} onPress={navigateToCart}>
        <Ionicons name="cart-outline" size={24} color={colors.text3} />
        <Text style={[styles.navText, { color: colors.text3 }, textStyle]}>
          {translation.cart || 'Cart'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.navItem} onPress={navigateToFavorites}>
        <Ionicons name="heart-outline" size={24} color={colors.text3} />
        <Text style={[styles.navText, { color: colors.text3 }, textStyle]}>
          {translation.favorites || 'Favorites'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.navItem} onPress={navigateToProfile}>
        <Ionicons name="person-outline" size={24} color={colors.text3} />
        <Text style={[styles.navText, { color: colors.text3 }, textStyle]}>
          {translation.profile || 'Profile'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.text3,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
});

export default BottomNavigation;