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

2. Start the application:
   ```bash
   npx expo start
   ```
   
3. Proceed to the Expo Go and scan the QR code generated in the terminal


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
