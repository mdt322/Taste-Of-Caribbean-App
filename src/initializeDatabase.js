import { initializeMenuData } from './menuDB.js';

const init = async () => {
  try {
    console.log('Starting database initialization...');
    const result = await initializeMenuData();
    if (result) {
      console.log('✅ Database initialized successfully');
    } else {
      console.log('ℹ️ Database already contains data');
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
};

// Run initialization
init();