# ChitChat Application Features

This document provides a detailed overview of the features implemented in the ChitChat application.

## 1. Core Communication

- **Private Chat:** Secure one-on-one messaging between users.
- **Group Chat (Stores):** Public channels that any user can join. These double as storefronts for business users.
- **Real-Time Messaging:** Messages appear instantly without needing to refresh the page.
- **Rich Media Messages:**
  - **Text:** Standard text messaging.
  - **Images:** Share photos in chats.
  - **Files:** Share documents (e.g., PDFs).
  - **Presentations:** A special file type for business users to share presentations.
  - **Location:** Share a map with your current geographical location.

## 2. Social & Engagement

- **User Profiles:**
  - Customizable display name, avatar, and status message.
  - View other users' profiles.
- **User Status:** See if a user is currently online or offline.
- **Ephemeral Stories:**
  - Post temporary image-based stories visible to contacts.
  - View stories from other users in a dedicated reel on the home page.

## 3. Social Commerce & Business Features

- **Account Tiers:**
  - **Regular Users:** Can participate in all chat features, view stores, and purchase items.
  - **Business Users:** Have all regular user features plus the ability to create stores and list products.
- **Stores:**
  - Business users can create public group chats that function as stores.
  - Stores have a unique name and avatar.
  - All users are automatically added to new stores.
- **Product Management:**
  - Business users can list products for sale within their stores.
  - Products have a name, description, price, and image.
  - Users can edit or delete products they have listed.
- **In-App Purchasing:**
  - Users can "buy" products from a store.
  - A purchase action sends a confirmation message into the chat, notifying the seller and creating a record of the transaction.

## 4. User Interface & User Experience

- **Responsive Design:** The application is fully responsive and optimized for mobile-first use, with a desktop-friendly layout.
- **Light & Dark Modes:** A theme switcher allows users to toggle between light and dark visual themes.
- **Modern UI Components:** Built with the sleek and accessible ShadCN UI component library.
- **Intuitive Navigation:** A clean and simple navigation structure makes it easy to move between chats, stores, and the user's profile.
- **Toasts/Notifications:** The app provides non-intrusive feedback for actions like saving a profile, sending a message, or encountering an error.
