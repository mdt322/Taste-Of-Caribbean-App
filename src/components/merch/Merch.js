import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useMerch } from '../../hooks/useMerch';
import MenuManagerModal from '../admin/MenuManagerModal';
import FloatingMenuButton from '../admin/FloatingMenuButton';

const Merch = ({ addToCart, setCartFlag, cart, user }) => {
    const { merchItems, loading, error } = useMerch();
    const [isMenuManagerModalVisible, setIsMenuManagerModalVisible] = useState(false);
    // const [selectedCategory, setSelectedCategory] = useState('All');

    // Calculates total quantity of items in the cart to show in the button
    let totalQuantity = cart.reduce((prevQuantity, currentItem) => prevQuantity + currentItem.quantity, 0);

    const handleSaveMenuItem = (item, type) => {
        console.log('Saving merch item:', item, type);
        // Here you would typically save to your backend/database
    };

    const handleDeleteMenuItem = (itemId, type) => {
        console.log('Deleting merch item:', itemId, type);
        // Here you would typically delete from your backend/database
    };

    const openMenuManager = () => {
        setIsMenuManagerModalVisible(true);
    };

    const closeMenuManager = () => {
        setIsMenuManagerModalVisible(false);
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <Text>Loading menu...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>Error: {error.message}</Text>
            </View>
        );
    }

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                {item.imageUrl ? (
                    <Image source={{ uri: item.imageUrl }} style={styles.image} />
                ) : (
                    <View style={[styles.image, styles.placeholderImage]}>
                        <Text style={styles.placeholderText}>{item.name[0]}</Text>
                    </View>
                )}
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>${typeof item.price === 'number' ? item.price.toFixed(2) : item.price.replace('$', '')}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <TouchableOpacity
                    style={styles.addToCartButton}
                    onPress={() => addToCart(item)}
                >
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <>
            {/* Floating cart button */}
            <TouchableOpacity
                style={styles.floatingCartButton}
                onPress={() => setCartFlag(true)}
            >
                <Text style={styles.floatingCartButtonText}>
                    {'\u{1F6D2}'} {totalQuantity > 0 && `${totalQuantity}`}
                </Text>
            </TouchableOpacity>

            <View style={styles.header}>
                <Text style={styles.title}>Merch</Text>
            </View>

            <FlatList
                data={merchItems}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                numColumns={2}
                contentContainerStyle={styles.merchList}
            />

            {/* Floating Menu Manager Button - Admin Only */}
            <FloatingMenuButton 
                visible={user?.isAdmin} 
                onPress={openMenuManager} 
            />

            {/* Menu Manager Modal */}
            <MenuManagerModal
                visible={isMenuManagerModalVisible}
                onClose={closeMenuManager}
                user={user}
                onSaveItem={handleSaveMenuItem}
                onDeleteItem={handleDeleteMenuItem}
            />
        </>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    merchList: {
        padding: 8,
        paddingBottom: 80,
    },
    card: {
        flex: 1,
        margin: 8,
        backgroundColor: '#fff',
        borderRadius: 12,
        maxWidth: '45%',
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    addToCartButton: {
        backgroundColor: '#2e8b57',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 8,
    },
    addToCartText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    imageContainer: {
        height: 120,
        backgroundColor: '#f5f5f5',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 32,
        color: '#ccc',
    },
    cardContent: {
        padding: 12,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 14,
        color: '#ffb300',
        fontWeight: '500',
        marginBottom: 4,
    },
    itemDescription: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
    },
    floatingCartButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        height: 70,
        width: 70,
        borderRadius: 50,
        backgroundColor: '#ffb300',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5,
        elevation: 5,
    },
    floatingCartButtonText: {
        color: '#ffffff',
        fontSize: 27,
    },
});

export default Merch;
