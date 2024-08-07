# Activities Tracker

This is a web application designed to manage activities recommended by influencers on TikTok and Instagram.

## Current Features

- **CRUD Operations**: Manage activities with Create, Read, Update, and Delete functionalities.

## What Needs to be Implemented

- **User Authentication**: Implement a secure login system using JSON Web Tokens (JWT) for user authentication.
- **Search and Filter**: Add functionality to search and filter activities based on location, type, or date.
- **Responsive Design**: Optimize the app for various devices, ensuring a seamless experience on desktop and mobile.
- **Additional CRUD Functionality**: Extend CRUD operations to include more detailed activity management features.

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/username/activities-tracker.git
   cd activities-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Create a `.env` file in the root directory with the following:
     ```plaintext
     PORT=3000
     MONGO_URI=mongodb://localhost:27017/activitiesTracker
     JWT_SECRET=your_jwt_secret
     ```

## Usage

1. **Start the server:**
   ```bash
   npm start
   ```

2. **Open** `http://localhost:3000` **in your web browser.**

3. **Begin managing activities with CRUD operations.**

## Technologies Used

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Authentication:** JSON Web Tokens (JWT)
- **Other Tools:** dotenv for environment variables, bcrypt.js for password hashing
