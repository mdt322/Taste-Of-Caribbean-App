# Taste of Caribbean App

A food ordering app inspired by Caribbean cuisine.

## Project Overview

The Taste of Caribbean mobile app is an interface built with React Native and Expo. Through the app, users to able to do the following:
- Browse Caribbean dishes or restaurant merchandise, add those items to cart, and placing orders for delivery or pickup.
- Log in or register for a dedicated account that is able to track their loyalty through a points system
- Redeem said points to receive reward items that include items from the menu or merchandise catalogue.

The app also currently enables privileged actions that can be performed by certain accounts, which includes:
- Accessing a table showing the status of each dedicated account in the database.
- Managing the contents of the menu, merchandise catalogue, and rewards shop content (FRONTEND INTERFACE DEMO COMPLETE, NO BACKEND SUPPORT)

### Key Features and Additions

- Browse menu and merchandise items by category (Appetizers, Main Dishes, Drinks)
- Rewards shop page featuring items from both the menu and merchandise catalogue
- View detailed item descriptions and images
- Add items to cart and adjust quantities with revised cart functions
- View order summary with subtotal, tax, and delivery fee
- User authentication (login/register)
- Account profile page complete with functions such as password reset
- Rewards program for loyal customers through the use of points gained at purchase

## Getting Started

*Visual studio used in the following steps

### How to run the frontend

1. After git clone or unzipping main code package, open terminal in project directory. Install dependencies with the following command:
   ```bash
   npm install
   ```
2. Create .env file using the .env.example file provided in the main directory of the project (for db credentials, contact project manager).
3. Run the following in the terminal to start the application and a QR code will be generated:
   ```bash
   npx expo start
   ```
4. Proceed to download and install Expo Go from the App Store (iOS) or Google Play Store (Android). Using its QR scanner, scan the generated QR code. Depending on whether there is a new version of SDK being used, it may prompt you to install an older version of Expo Go to test the app. It will give you instructions and an APK file to install.

**Note:** There will be warnings about certain modules in package.json being outdated. If all options to fix any problems are exhausted, resort to updating those modules.

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

   **Note:** When testing the app through Expo Go on your mobile device, alter your .env in the main project directory and uncomment the entry for REACT_APP_BACKEND_URL Insert your backend's ip url where prompted.

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
