# Gimmick Games Platform 
Access our website through [Gimmick Games](https://gimmickgames-1.onrender.com)

## Overview
Gimmick Games is an online platform featuring two mini-games designed for casual and experienced gamers alike. The platform includes essential features such as user authentication, profile management, game selection, score saving, and leaderboards. The project is built using **Node.js**, **Express.js**, and **MongoDB**, providing a responsive and interactive gaming experience across modern web browsers.

## Features
- **User Authentication**: Secure sign-up, login, and password reset functionality.
- **Profile Management**: Registered users can view and edit their profiles.
- **Game Selection**: Users can choose between two mini-games:
  - **Snake Game**: Control a snake, eat food, and avoid crashing into yourself.
  - **Space Invaders**: Defend against waves of aliens by controlling a spaceship.
- **Score Saving**: Registered users can save their scores.
- **Leaderboards**: View top players for each game.

## Technology Stack
- **Backend**: 
  - **Node.js** with **Express.js** for server-side logic.
  - **MongoDB** as the NoSQL database to store user data and game scores.
- **Frontend**: 
  - HTML, CSS, JavaScript, and the **Bootstrap** framework for a responsive user interface.
  - **EJS (Embedded JavaScript)** for dynamic content rendering.
- **API**: RESTful API to manage data transfer between client and server.
- **Security**: Passwords are hashed using **bcrypt**, and the platform ensures secure communication through **HTTPS**.

## Functionalities
### 1. User Authentication
- **Sign Up**: Users can register with their email and password.
- **Login**: Registered users can log in with their credentials.
- **Password Reset**: Users can reset forgotten passwords via email.

### 2. Profile Management
- **View Profile**: Users can view their profile details and game scores.
- **Edit Profile**: Users can update their username or password.
- **Delete Account**: Users have the option to delete their account.

### 3. Game Selection and Play
- **Snake Game**: Control the snake using arrow keys to collect food, and avoid hitting the walls or the snake’s body.
- **Space Invaders**: Control a spaceship, shoot down aliens, and avoid being hit by them.
  
### 4. Score Saving and Leaderboards
- **Score Saving**: Registered users can save their scores after each game.
- **Leaderboard**: Displays top scores for each game and allows users to view their personal scores.

### 5. Admin Functions
- **User Management**: Admins can manage user accounts (view, edit, or delete).
- **Game Management**: Admins can add, update, or remove games from the platform.

## Setup Instructions
### Prerequisites
- **Node.js**: Ensure Node.js is installed on your machine. Verify by running `node -v` in your terminal.
- **MongoDB**: MongoDB must be installed and configured locally.

### Local Setup
1. Clone the repository.
2. Install the required dependencies by running:
   ```
   npm install
   ```
3. Run the application:
   ```
   npm run serve
   ```
4. Open your browser and navigate to `localhost:3000` to access Gimmick Games.

### Hosting on Render
The platform is hosted on Render and can be accessed via [this link](https://gimmickgames-1.onrender.com).

## Design and Architecture
- **MVC Architecture**: The platform follows the **Model-View-Controller** design pattern for better separation of concerns.
- **Responsive UI**: The frontend is designed using Bootstrap to ensure responsiveness across devices.

## Non-Functional Requirements
- **Security**: User data is securely handled using bcrypt for password hashing, and communication is encrypted using HTTPS.
- **Performance**: The platform is optimized to handle up to 1000 concurrent users with minimal latency.
- **Usability**: The user interface is intuitive and follows accessibility guidelines (WCAG 2.1).

## Future Enhancements
- Add more games to expand the platform.
- Implement additional features such as multiplayer mode.
- Enhance the leaderboard with advanced filtering and sorting options.

## References
- https://youtu.be/uyhzCBEGaBY?si=9hBFEq4B7Sfm58fx
- https://youtu.be/qCBiKJbLcFI?si=M2Bgb5C6b3f0n5aR
