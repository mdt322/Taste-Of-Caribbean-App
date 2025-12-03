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

The Following is used in the production of this app:

- Visual Studio
- Node.js (version 20+)
- NPM (version 10+)
- Expo CLI (version 6+)

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

### How to run the backend

1. Install Docker Desktop from https://www.docker.com/products/docker-desktop
2. Globally install Expo-CLI through a terminal/command prompt
   ```bash
   npm install -g expo-cli
   ```
3. Navigate to the backend folder "server" from the project's main directory then use the .env.example file to create a .env file to set up the environment for the docker (for db credentials, contact project manager)
4. Open a terminal in the server folder and run the following to install dependencies:
   ```bash
   npm install
   ```
5. Edit the .env file in the project's root directory and make sure the field for REACT_APP_BACKEND_URL contains your current local ip address. It should look like this:
   ```bash
   REACT_APP_BACKEND_URL=http://(Your IP here):5001
   ```
   To view your current IP address, run the following in a command prompt window:
   ```bash
   ipconfig
   ```
6. Start Docker Desktop then run the following commands in the terminal opened in the server directory:
   ```bash
   docker-compose down
   docker-compose up --build
   ```

### Technologies Used

- React Native / Expo
- Firebase (Menu, Merchandise Database)
- React Navigation
- React Native Elements
- MySQL (Accounts Backend)
