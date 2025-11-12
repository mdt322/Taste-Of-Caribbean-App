import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { buildApiUrl } from '../utils/apiConfig';

const CustomerItem = ({ customer, onPress }) => (
  <TouchableOpacity style={styles.customerItem} onPress={() => onPress(customer)}>
    <Text style={styles.customerId}>{customer.id || 'N/A'}</Text>
    <Text style={styles.customerName}>{customer.full_name || 'N/A'}</Text>
    <Text style={styles.customerEmail}>{customer.email || 'N/A'}</Text>
    <Text style={styles.customerPoints}>{customer.rewards || '0'} pts</Text>
  </TouchableOpacity>
);

const CustomerDetail = ({ customer, onBack }) => {
  if (!customer) return null;

  return (
    <View style={styles.detailContainer}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>← Back to List</Text>
      </TouchableOpacity>
      
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
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Role:</Text>
          <Text style={styles.detailValue}>{customer.role || 'user'}</Text>
        </View>
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
        <TouchableOpacity 
          style={styles.headerCell} 
          onPress={() => onSortChange('id')}
        >
          <Text style={styles.headerText}>
            ID {sortBy === 'id' ? '▼' : ''}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.headerCell, { flex: 2 }]}
          onPress={() => onSortChange('name')}
        >
          <Text style={styles.headerText}>
            Name {sortBy === 'name' ? '▼' : ''}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.headerCell, { flex: 2 }]}
          onPress={() => onSortChange('rewards')}
        >
          <Text style={styles.headerText}>
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
        console.log('Response data:', data);
      } catch (jsonError) {
        // If parsing as JSON fails, log the raw response
        console.error('Failed to parse response as JSON:', responseText);
        throw new Error(`Server returned non-JSON response: ${responseText.substring(0, 100)}...`);
      }
      
      if (response.ok) {
        console.log('Successfully fetched customers:', data);
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
      <Text style={styles.title}>Customer Overview</Text>
      
      {selectedCustomer ? (
        <CustomerDetail 
          customer={selectedCustomer} 
          onBack={() => setSelectedCustomer(null)} 
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
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
  },
  customerItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  customerId: {
    flex: 1,
    fontWeight: '500',
  },
  customerInfo: {
    flex: 1,
    textAlign: 'center',
  },
  customerPoints: {
    flex: 1,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  detailContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginTop: 10,
  },
  backButton: {
    marginBottom: 20,
    padding: 10,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
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
