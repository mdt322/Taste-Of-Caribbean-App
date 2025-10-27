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

### How to Run the Project: frontend

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create .env file using the .env.example file provided in the main directory of the project (for db credentials, contact project manager).
3. Run the following in the terminal to start the application and a QR code will be generated in the terminal:
   ```bash
   npx expo start
   ```
4. Proceed to the Expo Go and scan the generated QR code. It may prompt you to install an older version of Expo Go to test the app if you're testing it on Android. It will give you instructions and an APK file to install.

**Note:** Make sure to check `package.json` and `package-lock.json` to ensure the dependencies are updated.

### How to Run the Project: backend

1. Install Node.js v20+ from https://nodejs.org
2. Install Docker Desktop from https://www.docker.com/products/docker-desktop
3. Globally install Expo-CLI
   ```bash
   npm install -g expo-cli
   ```
4. Navigate to the backend folder "server" and use each .example file to set up the environment for docker (database credentials go into .env, contact project manager)
5. Run the following commands in the terminal with "server" as the current directory:
   ```bash
   docker-compose down
   docker-compose up --build
   ```

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
