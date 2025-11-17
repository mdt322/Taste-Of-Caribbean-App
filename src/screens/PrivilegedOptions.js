import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { buildApiUrl } from '../utils/apiConfig';

const CustomerItem = ({ customer, onPress }) => (
  <TouchableOpacity style={styles.customerItem} onPress={() => onPress(customer)}>

    {/* Customer ID */}
    <View style={[styles.customerCell, { flex: 0 }]}>
      <Text style={{ fontWeight: '500' }}>{customer.id || 'N/A'}</Text>
    </View>

    {/* Customer Name and Email */}
    <View style={[styles.customerCell, { flex: 1, flexDirection: 'row' }]}>
      <Text numberOfLines={1} ellipsizeMode="tail">
        <Text style={{ fontWeight: '500' }}>{customer.full_name || 'N/A'}</Text> | {customer.email || 'N/A'}
      </Text>
    </View>

    {/* Customer Points */}
    <View style={[styles.customerCell, { flex: 0 }]}>
      <Text style={{ fontWeight: '500' }}>{customer.rewards || '0'} pts</Text>
    </View>
  </TouchableOpacity>
);

// Define role permissions
const ROLE_PERMISSIONS = {
  customer: {
    canViewMenu: true,
    canOrder: true,
    canEarnPoints: true,
    canRedeemRewards: true,
    canViewOwnOrders: true,
    canViewOwnProfile: true,
    canManageMenu: false,
    canManageUsers: false,
    canViewAnalytics: false
  },
  employee: {
    canViewMenu: true,
    canOrder: true,
    canEarnPoints: true,
    canRedeemRewards: true,
    canViewOwnOrders: true,
    canViewAllOrders: true,
    canViewOwnProfile: true,
    canProcessOrders: true,
    canManageMenu: false,
    canManageUsers: false,
    canViewAnalytics: true
  },
  admin: {
    canViewMenu: true,
    canOrder: true,
    canEarnPoints: true,
    canRedeemRewards: true,
    canViewAllOrders: true,
    canManageMenu: true,
    canManageUsers: true,
    canViewAnalytics: true,
    canManageSettings: true,
    canProcessRefunds: true
  }
};

const CustomerDetail = ({ customer, onBack, onRoleUpdate }) => {
  const [selectedRole, setSelectedRole] = useState(customer.role || 'customer');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showRoleChange, setShowRoleChange] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const [pendingRole, setPendingRole] = useState(null);

  if (!customer) return null;

  const handleRoleChange = (newRole) => {
    setPendingRole(newRole);
    setShowRoleDropdown(false);
    setShowRoleChange(true);
  };

  const toggleRoleDropdown = () => {
    setShowRoleDropdown(!showRoleDropdown);
  };

  const getRoleDisplayName = (role) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const confirmRoleChange = async () => {
    if (!pendingRole) return;
    
    try {
      setIsUpdating(true);
      await onRoleUpdate(customer.id, pendingRole);
      setSelectedRole(pendingRole);
      setShowRoleChange(false);
      setPendingRole(null);
      Alert.alert('Success', `Role updated to ${pendingRole}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update role. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const cancelRoleChange = () => {
    setShowRoleChange(false);
    setPendingRole(null);
  };

  const renderPermissions = (role) => {
    const permissions = ROLE_PERMISSIONS[role] || {};
    return (
      <View style={styles.permissionsContainer}>
        <Text style={styles.permissionsTitle}>Permissions:</Text>
        {Object.entries(permissions).map(([key, value]) => (
          <View key={key} style={styles.permissionItem}>
            <Text style={styles.permissionText}>
              • {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
            </Text>
            <Text style={[styles.permissionValue, value ? styles.allowed : styles.denied]}>
              {value ? '✓ Allowed' : '✗ Denied'}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.detailContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onBack}
        >
          <Text style={styles.backButtonText}>← Back to List</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.detailCard}>
        <Text style={styles.detailTitle}>Customer Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>ID:</Text>
          <Text style={styles.detailValue}>{customer.id || 'N/A'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Name:</Text>
          <Text style={styles.detailValue}>{customer.full_name || 'N/A'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Email:</Text>
          <Text style={styles.detailValue}>{customer.email || 'N/A'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Phone:</Text>
          <Text style={styles.detailValue}>{customer.phone || 'N/A'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Loyalty Points:</Text>
          <Text style={styles.detailValue}>{customer.rewards || '0'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Member Since:</Text>
          <Text style={styles.detailValue}>
            {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'N/A'}
          </Text>
        </View>
        <View style={[styles.detailRow, { alignItems: 'center' }]}>
          <Text style={styles.detailLabel}>Role:</Text>
          <View style={styles.roleSelectorContainer}>
            {isUpdating ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              <View style={styles.roleSelectorWrapper}>
                <TouchableOpacity 
                  style={styles.roleDisplay}
                  onPress={toggleRoleDropdown}
                  disabled={isUpdating}
                >
                  <Text style={styles.roleDisplayText}>
                    {getRoleDisplayName(selectedRole)}
                  </Text>
                  <Text style={styles.dropdownIcon}>▼</Text>
                </TouchableOpacity>
                
                {showRoleDropdown && (
                  <View style={styles.roleDropdown}>
                    {['customer', 'employee', 'admin'].map((role) => (
                      <TouchableOpacity
                        key={role}
                        style={[
                          styles.roleOption,
                          selectedRole === role && styles.roleOptionSelected
                        ]}
                        onPress={() => handleRoleChange(role)}
                      >
                        <Text style={styles.roleOptionText}>
                          {getRoleDisplayName(role)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        {showRoleChange && (
          <View style={styles.confirmationContainer}>
            <Text style={styles.confirmationText}>
              Change role from {selectedRole} to {pendingRole}?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={cancelRoleChange}
                disabled={isUpdating}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.confirmButton]}
                onPress={confirmRoleChange}
                disabled={isUpdating}
              >
                <Text style={styles.buttonText}>
                  {isUpdating ? 'Updating...' : 'Confirm'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <TouchableOpacity 
          style={styles.togglePermissionsButton}
          onPress={() => setShowPermissions(!showPermissions)}
        >
          <Text style={styles.togglePermissionsText}>
            {showPermissions ? 'Hide Permissions' : 'View Permissions'}
          </Text>
        </TouchableOpacity>

        {showPermissions && renderPermissions(selectedRole)}
      </View>
    </View>
  );
};

const CustomerList = ({ customers = [], onSelectCustomer, sortBy = 'id', onSortChange }) => {
  // Sort customers based on the selected field
  const sortedCustomers = [...customers].sort((a, b) => {
    if (sortBy === 'id') return a.id - b.id;
    if (sortBy === 'name') return (a.full_name || '').localeCompare(b.full_name || '');
    if (sortBy === 'email') return (a.email || '').localeCompare(b.email || '');
    if (sortBy === 'rewards') return (b.rewards || 0) - (a.rewards || 0);
    return 0;
  });

  return (
    <View style={styles.listContainer}>
      <View style={styles.headerRow}>

        {/* ID */}
        <TouchableOpacity
          style={[styles.headerCell, { flex: 0 }]}
          onPress={() => onSortChange('id')}
        >
          <Text style={styles.headerText}>
            ID {sortBy === 'id' ? '▼' : ''}
          </Text>
        </TouchableOpacity>

        {/* Name */}
        <TouchableOpacity
          style={[styles.headerCell, { flex: 1 }]}
          onPress={() => onSortChange('name')}
        >
          <Text style={styles.headerText}>
            Name | Email {sortBy === 'name' ? '▼' : ''}
          </Text>
        </TouchableOpacity>

        {/* Points */}
        <TouchableOpacity
          style={[styles.headerCell, { flex: 0 }]}
          onPress={() => onSortChange('rewards')}
        >
          <Text style={[styles.headerText, { alignItems: 'right' }]}>
            Points {sortBy === 'rewards' ? '▼' : ''}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedCustomers}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <CustomerItem
            customer={item}
            onPress={onSelectCustomer}
          />
        )}
      />
    </View>
  );
};

const PrivilegedOptions = ({ onNavigate }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [sortBy, setSortBy] = useState('id');
  const [currentUserRole, setCurrentUserRole] = useState('admin'); // This should come from your auth context
  
  const handleBackToProfile = () => {
    onNavigate('More');
  };
  
  const handleRoleUpdate = async (userId, newRole) => {
    try {
      // Call your API to update the user's role
      const response = await fetch(buildApiUrl(`/api/users/${userId}/role`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Add auth token if needed
          // 'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error('Failed to update role');
      }

      // Update the local state to reflect the change
      setCustomers(customers.map(customer => 
        customer.id === userId ? { ...customer, role: newRole } : customer
      ));
      
      if (selectedCustomer && selectedCustomer.id === userId) {
        setSelectedCustomer({ ...selectedCustomer, role: newRole });
      }

      return true;
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  };
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const url = buildApiUrl('/api/admin/customers');
      console.log('Fetching customers from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add any required authentication headers here
        },
      });

      console.log('Response status:', response.status);

      const responseText = await response.text();
      let data;

      try {
        data = JSON.parse(responseText);
        // commented out to not clutter terminal
        // console.log('Response data:', data);
      } catch (jsonError) {
        // If parsing as JSON fails, log the raw response
        console.error('Failed to parse response as JSON:', responseText);
        throw new Error(`Server returned non-JSON response: ${responseText.substring(0, 100)}...`);
      }

      if (response.ok) {
        console.log('Successfully fetched customers:'
          // commented out to not clutter terminal
          //, data
        );
        // Ensure data is an array before setting it
        if (Array.isArray(data)) {
          setCustomers(data);
        } else {
          console.warn('Expected an array of customers, but got:', data);
          setCustomers([]);
        }
      } else {
        const errorMsg = data.message || `Failed to fetch customers: ${response.status} ${response.statusText}`;
        console.error('Error fetching customers:', errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortedCustomers = [...customers].sort((a, b) => {
    if (sortBy === 'last_transaction') {
      const dateA = a[sortBy] ? new Date(a[sortBy]) : new Date(0);
      const dateB = b[sortBy] ? new Date(b[sortBy]) : new Date(0);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }
    if (sortBy === 'loyalty_points') {
      return sortOrder === 'asc'
        ? (a[sortBy] || 0) - (b[sortBy] || 0)
        : (b[sortBy] || 0) - (a[sortBy] || 0);
    }
    return sortOrder === 'asc'
      ? String(a[sortBy]).localeCompare(String(b[sortBy]))
      : String(b[sortBy]).localeCompare(String(a[sortBy]));
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackToProfile}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Customer Overview</Text>
      </View>

      {selectedCustomer ? (
        <CustomerDetail
          customer={selectedCustomer}
          onBack={() => setSelectedCustomer(null)}
          onRoleUpdate={handleRoleUpdate}
        />
      ) : (
        <CustomerList
          customers={sortedCustomers}
          onSelectCustomer={setSelectedCustomer}
          sortBy={sortBy}
          onSortChange={handleSort}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  roleSelectorContainer: {
    flex: 1,
    marginLeft: 10,
  },
  // Add new styles for the enhanced UI
  confirmationContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  confirmationText: {
    fontSize: 16,
    marginBottom: 12,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginLeft: 10,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  permissionsContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  permissionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  permissionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  permissionText: {
    flex: 1,
    color: '#495057',
  },
  permissionValue: {
    fontWeight: '500',
    marginLeft: 10,
  },
  allowed: {
    color: '#28a745',
  },
  denied: {
    color: '#dc3545',
  },
  togglePermissionsButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    alignItems: 'center',
  },
  togglePermissionsText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  roleSelectorWrapper: {
    position: 'relative',
    flex: 1,
  },
  roleDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  roleDisplayText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  roleDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginTop: 4,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  roleOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  roleOptionSelected: {
    backgroundColor: '#f8f9fa',
  },
  roleOptionText: {
    fontSize: 16,
    color: '#333',
  },
  roleSelector: {
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
  },
  picker: {
    height: 40,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerCell: {
    paddingHorizontal: 10,
    minWidth: 50,
  },
  headerText: {
    fontWeight: 'bold',
  },
  customerCell: {
    paddingHorizontal: 10,
    minWidth: 50,
  },
  customerItem: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 10,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  detailContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginTop: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginTop: 10,
  },
  backButton: {
    padding: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: -2,
  },
  detailCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 20,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  detailLabel: {
    width: 120,
    fontWeight: '600',
    color: '#555',
  },
  detailValue: {
    flex: 1,
  },
});

export default PrivilegedOptions;