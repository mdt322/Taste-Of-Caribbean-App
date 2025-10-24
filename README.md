# Taste of Caribbean App
A food ordering app inspired by Caribbean cuisine.

## Project Overview

Taste of Caribbean is a mobile food ordering application built with React Native and Expo. The app allows users to browse Caribbean dishes, add items to cart, and place orders for delivery or pickup.

### Key Features

- Browse menu items by category (Appetizers, Main Dishes, Drinks)
- View detailed item descriptions and images
- Add items to cart and adjust quantities
- View order summary with subtotal, tax, and delivery fee
- User authentication (login/register)
- Rewards program for loyal customers

## Getting Started

### How to Run the Project

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create .env file with the following content, which is needed for the menu and other elements to load:
   ```
   REACT_APP_FIREBASE_API_KEY='AIzaSyAPD9aOi7WH6ZjB7nRQzU5u7FNzlIqLHE0'
   # REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain-here #placeholder for something
   REACT_APP_FIREBASE_PROJECT_ID='toc-menu-data'
   REACT_APP_FIREBASE_STORAGE_BUCKET='toc-menu-data.appspot.com'
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID='1034732460799'
   REACT_APP_FIREBASE_APP_ID='1:1034732460799:ios:efceffced500d5c2614aca'
   ```
4. Run the following in the terminal to start the application and a QR code will be generated in the terminal:
   ```bash
   npx expo start
   ```
5. Proceed to the Expo Go and scan the generated QR code. It may prompt you to install an older version of Expo Go to test the app if you're testing it on Android. It will give you instructions and an APK file to install.

**Note:** Make sure to check `package.json` and `package-lock.json` to ensure the dependencies are updated.

### Project Structure

```
/src
  /assets         # Images and other static assets
  /components     # UI components organized by feature
    /auth         # Authentication components (Login, Register)
    /checkout     # Checkout flow components
    /menu         # Menu-related components
    /rewards      # Rewards program components
  /services       # External service integrations (Firebase)
  /utils          # Utility functions and helpers
  App.js          # Main application component
  index.js        # Application entry point
```

### Technologies Used

- React Native / Expo
- Firebase (Authentication, Database)
- React Navigation
- React Native Elements
