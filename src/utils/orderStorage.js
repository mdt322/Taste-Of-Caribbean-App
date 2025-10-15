import * as FileSystem from 'expo-file-system';

const ORDERS_FILE = FileSystem.documentDirectory + 'orders.json';

export const saveOrder = async (order) => {
  try {
    // Create new order object with timestamp
    const newOrder = {
      ...order,
      orderId: Date.now().toString(),
      orderDate: new Date().toISOString(),
    };

    // Read existing orders file or create empty array if it doesn't exist
    let existingOrders = [];
    try {
      const fileContent = await FileSystem.readAsStringAsync(ORDERS_FILE);
      existingOrders = JSON.parse(fileContent);
    } catch (e) {
      // File doesn't exist yet, that's okay
    }

    // Add new order to existing orders
    const updatedOrders = [...existingOrders, newOrder];

    // Save updated orders to file
    await FileSystem.writeAsStringAsync(
      ORDERS_FILE,
      JSON.stringify(updatedOrders, null, 2)
    );

    console.log(`Order saved to ${ORDERS_FILE}`);
    return newOrder.orderId;
  } catch (error) {
    console.error('Error saving order:', error);
    throw error;
  }
};

// Utility function to get all orders
export const getAllOrders = async () => {
  try {
    const fileContent = await FileSystem.readAsStringAsync(ORDERS_FILE);
    return JSON.parse(fileContent);
  } catch (error) {
    // If file doesn't exist, return empty array
    return [];
  }
};
