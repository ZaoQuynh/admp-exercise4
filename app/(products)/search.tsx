import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
const productData = [
  {
    id: 1,
    plant: {
      id: 101,
      name: "Cây Monstera",
      img: "https://example.com/monstera.jpg",
      descriptions: [{ text: "Cây cảnh nội thất phổ biến" }],
      attributes: [{ key: "Size", value: "Lớn" }],
    },
    price: 300000,
    discount: 10,
    stockQty: 5,
    reviews: [],
    isDeleted: false,
  },
  {
    id: 2,
    plant: {
      id: 102,
      name: "Cây Xương Rồng",
      img: "https://example.com/cactus.jpg",
      descriptions: [{ text: "Cây dễ chăm sóc" }],
      attributes: [{ key: "Size", value: "Nhỏ" }],
    },
    price: 150000,
    discount: 5,
    stockQty: 10,
    reviews: [],
    isDeleted: false,
  },
];
const SearchScreen = () => {
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState(productData);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleSearch = (text) => {
    setQuery(text);
    if (text) {
      const filtered = productData.filter((item) =>
        item.plant.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(productData);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.item}
      onPress={() => {/* Thêm navigation đến chi tiết sản phẩm nếu cần */}}
    >
      <Image 
        source={{ uri: item.plant.img }} 
        style={styles.image} 
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.title}>{item.plant.name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            {(item.price * (1 - item.discount/100)).toLocaleString()}đ
          </Text>
          <Text style={styles.originalPrice}>
            {item.price.toLocaleString()}đ
          </Text>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{item.discount}%</Text>
          </View>
        </View>
        <Text style={styles.stock}>
          {item.stockQty > 0 ? `Còn ${item.stockQty} sản phẩm` : "Hết hàng"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchBox}
            placeholder="Tìm kiếm sản phẩm..."
            value={query}
            onChangeText={handleSearch}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={50} color="#999" />
              <Text style={styles.empty}>Không tìm thấy sản phẩm</Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 5,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    marginLeft: 10,
  },
  searchIcon: {
    marginLeft: 15,
  },
  searchBox: {
    flex: 1,
    height: 45,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#333",
  },
  listContent: {
    padding: 15,
  },
  item: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontWeight: "600",
    fontSize: 18,
    color: "#333",
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 5,
  },
  price: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  originalPrice: {
    color: "#999",
    fontSize: 14,
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  discountBadge: {
    backgroundColor: "#FF5722",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  stock: {
    fontSize: 13,
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  empty: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    marginTop: 10,
  },
});

export default SearchScreen;