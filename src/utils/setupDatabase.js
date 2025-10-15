import { initializeMenuData } from './initializeMenuData';

// Run this function to set up initial menu data
const setupDatabase = async () => {
  console.log('Setting up database...');
  await initializeMenuData();
  console.log('Database setup complete!');
};

// Run the setup
setupDatabase();
