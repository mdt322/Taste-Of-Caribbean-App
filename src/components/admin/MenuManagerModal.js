import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  Alert,
  Switch,
  Image,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../utils/theme';
import { menuItems } from '../../menuData';

export const MenuManagerModal = ({ visible, onClose, user, onSaveItem, onDeleteItem }) => {
  const [activeTab, setActiveTab] = useState('menu');
  const [editingItem, setEditingItem] = useState(null);
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
  const [menuItemsList, setMenuItemsList] = useState(menuItems);
  const [merchItemsList, setMerchItemsList] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image: '',
    includeInRewards: false
  });

  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || '',
        category: editingItem.category || '',
        price: editingItem.price || '',
        description: editingItem.description || '',
        image: editingItem.image || '',
        includeInRewards: editingItem.includeInRewards || false
      });
      setImageUri(editingItem.image || null);
    } else if (isAddingNewItem) {
      setFormData({
        name: '',
        category: '',
        price: '',
        description: '',
        image: '',
        includeInRewards: false
      });
      setImageUri(null);
    }
  }, [editingItem, isAddingNewItem]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setFormData({ ...formData, image: result.assets[0].uri });
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.price) {
      Alert.alert('Error', 'Name and price are required');
      return;
    }

    const updatedItem = {
      ...formData,
      id: editingItem ? editingItem.id : Date.now().toString(),
      price: formData.price.startsWith('$') ? formData.price : `$${formData.price}`
    };

    if (activeTab === 'menu') {
      if (editingItem) {
        setMenuItemsList(prev => prev.map(item => 
          item.id === editingItem.id ? updatedItem : item
        ));
      } else {
        setMenuItemsList(prev => [...prev, updatedItem]);
      }
    } else {
      if (editingItem) {
        setMerchItemsList(prev => prev.map(item => 
          item.id === editingItem.id ? updatedItem : item
        ));
      } else {
        setMerchItemsList(prev => [...prev, updatedItem]);
      }
    }

    onSaveItem && onSaveItem(updatedItem, activeTab);
    resetForm();
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete ${item.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            if (activeTab === 'menu') {
              setMenuItemsList(prev => prev.filter(i => i.id !== item.id));
            } else {
              setMerchItemsList(prev => prev.filter(i => i.id !== item.id));
            }
            onDeleteItem && onDeleteItem(item.id, activeTab);
          }
        }
      ]
    );
  };

  const resetForm = () => {
    setEditingItem(null);
    setIsAddingNewItem(false);
    setFormData({
      name: '',
      category: '',
      price: '',
      description: '',
      image: '',
      includeInRewards: false
    });
    setImageUri(null);
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setIsAddingNewItem(false);
  };

  const startAdd = () => {
    setEditingItem(null);
    setIsAddingNewItem(true);
  };

  const currentItems = activeTab === 'menu' ? menuItemsList : merchItemsList;

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{item.price}</Text>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => startEdit(item)}
        >
          <Ionicons name="create-outline" size={20} color={COLORS.primary.turquoise} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item)}
        >
          <Ionicons name="trash-outline" size={20} color={COLORS.semantic.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Menu Manager</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'menu' && styles.activeTab]}
            onPress={() => setActiveTab('menu')}
          >
            <Text style={[styles.tabText, activeTab === 'menu' && styles.activeTabText]}>
              Menu Items
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'merch' && styles.activeTab]}
            onPress={() => setActiveTab('merch')}
          >
            <Text style={[styles.tabText, activeTab === 'merch' && styles.activeTabText]}>
              Merch Items
            </Text>
          </TouchableOpacity>
        </View>

        {(editingItem || isAddingNewItem) ? (
          <ScrollView style={styles.formContainer}>
            <Text style={styles.formTitle}>
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Item name"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Category</Text>
              <TextInput
                style={styles.input}
                value={formData.category}
                onChangeText={(text) => setFormData({ ...formData, category: text })}
                placeholder="Category"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Price</Text>
              <TextInput
                style={styles.input}
                value={formData.price}
                onChangeText={(text) => setFormData({ ...formData, price: text })}
                placeholder="0.00"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Item description"
                multiline
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Image</Text>
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.previewImage} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="camera-outline" size={40} color={COLORS.text.secondary} />
                    <Text style={styles.imagePlaceholderText}>Tap to select image</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <View style={styles.switchContainer}>
                <Text style={styles.label}>Include in Rewards Shop</Text>
                <Switch
                  value={formData.includeInRewards}
                  onValueChange={(value) => setFormData({ ...formData, includeInRewards: value })}
                  trackColor={{ false: COLORS.border.light, true: COLORS.primary.turquoise }}
                  thumbColor={COLORS.neutral.white}
                />
              </View>
            </View>

            <View style={styles.formActions}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={resetForm}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : (
          <View style={styles.listContainer}>
            <TouchableOpacity style={styles.addButton} onPress={startAdd}>
              <Ionicons name="add" size={24} color={COLORS.neutral.white} />
              <Text style={styles.addButtonText}>Add New {activeTab === 'menu' ? 'Menu' : 'Merch'} Item</Text>
            </TouchableOpacity>

            <FlatList
              data={currentItems}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              style={styles.list}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
  },
  placeholder: {
    width: 32,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary.turquoise,
  },
  tabText: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text.secondary,
  },
  activeTabText: {
    color: COLORS.primary.turquoise,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  listContainer: {
    flex: 1,
    padding: SPACING.md,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary.turquoise,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  addButtonText: {
    color: COLORS.neutral.white,
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.medium,
    marginLeft: SPACING.sm,
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    backgroundColor: COLORS.background.secondary,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.primary,
  },
  itemPrice: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.primary.orange,
    marginTop: SPACING.xs,
  },
  itemActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: SPACING.sm,
    marginLeft: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  editButton: {
    backgroundColor: COLORS.background.primary,
    borderWidth: 1,
    borderColor: COLORS.primary.turquoise,
  },
  deleteButton: {
    backgroundColor: COLORS.background.primary,
    borderWidth: 1,
    borderColor: COLORS.semantic.error,
  },
  formContainer: {
    flex: 1,
    padding: SPACING.md,
  },
  formTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
  },
  formGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border.medium,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: TYPOGRAPHY.sizes.md,
    backgroundColor: COLORS.background.primary,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePicker: {
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background.secondary,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    borderStyle: 'dashed',
    borderRadius: BORDER_RADIUS.md,
  },
  imagePlaceholderText: {
    color: COLORS.text.secondary,
    marginTop: SPACING.sm,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xl,
  },
  button: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.background.secondary,
    marginRight: SPACING.sm,
  },
  cancelButtonText: {
    color: COLORS.text.primary,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  saveButton: {
    backgroundColor: COLORS.primary.turquoise,
    marginLeft: SPACING.sm,
  },
  saveButtonText: {
    color: COLORS.neutral.white,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
});

export default MenuManagerModal;
