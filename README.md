# EventZen Application Documentation

## **Overview**
EventZen is a comprehensive event management platform designed to cater to three types of users: **Admin**, **Vendor**, and **User**. The platform provides a seamless experience for managing events, registering attendees, and tracking finances. Each user type has specific roles and functionalities tailored to their needs, ensuring a streamlined workflow and efficient event management.

---

## **Features of the Application**

### **1. User Roles and Functionalities**

#### **Admin**
Admins have the highest level of access and control over the platform. Their responsibilities include:
- **Event Management**: 
  - Add, edit, or delete any event, whether created by a vendor or the admin themselves.
  - View all events categorized by the vendor who created them.
- **Attendee Management**:
  - View the list of attendees registered for any event, along with their details (e.g., name, email, phone).
- **Vendor Management**:
  - Monitor vendors and their associated events.

#### **Vendor**
Vendors are responsible for managing their own events. Their functionalities include:
- **Event Management**:
  - Create, edit, or delete events they have added.
  - View all events they have created.
- **Attendee Management**:
  - View the list of attendees registered for their events, along with their details.

#### **User**
Users are the primary attendees of events. Their functionalities include:
- **Event Browsing**:
  - View all events hosted on the platform.
- **Event Registration**:
  - Register for any event.
  - Withdraw from events they have registered for.
- **Dashboard**:
  - View a list of events they have registered for.
  - Manage their registrations by unregistering from events.

---

### **2. Database Design**
The application uses **MongoDB** as its database, with separate collections for each type of user and other entities. Below is an overview of the database structure:

#### **Collections**
1. **Users**:
   - Stores information about all users (Admins, Vendors, and Users).
   - Fields include `email`, `password`, `role`, `name`, `phone`, and `registeredEvents`.

2. **Events**:
   - Stores details about all events.
   - Fields include `title`, `description`, `date`, `location`, `capacity`, `price`, `vendorId`, `registeredAttendees`, and `status`.

3. **Bookings**:
   - Tracks user registrations for events.
   - Fields include `user`, `event`, `status`, `totalAmount`, and `paymentStatus`.

4. **Expenses**:
   - Tracks expenses for events.
   - Fields include `eventId`, `vendorId`, `category`, `amount`, `description`, and `date`.

5. **BudgetTracking**:
   - Tracks the budget and expenses for events.
   - Fields include `eventId`, `totalExpenses`, `remainingBudget`, and `isOverBudget`.

---

### **3. Module Details**

#### **Backend**
The backend is built using **Node.js** and **Express.js**, with **MongoDB** as the database. It provides RESTful APIs for all functionalities.

##### **Key Features**
1. **Authentication and Authorization**:
   - JWT-based authentication.
   - Role-based access control for Admin, Vendor, and User.

2. **API Endpoints**:
   - **Admin**:
     - Manage all events (CRUD operations).
     - View attendees for any event.
     - View events categorized by vendors.
   - **Vendor**:
     - Manage their own events (CRUD operations).
     - View attendees for their events.
   - **User**:
     - Register for events.
     - Withdraw from events.
     - View their registered events.

3. **Middleware**:
   - Authentication middleware to verify JWT tokens.
   - Role-based middleware to restrict access to specific endpoints.

4. **Error Handling**:
   - Centralized error handling for consistent API responses.

##### **Backend Directory Structure**
```
backend/
├── models/          # Mongoose schemas for database collections
├── routes/          # API routes for different modules
├── middleware/      # Authentication and role-based access control
├── index.js         # Entry point for the backend server
├── .env             # Environment variables (e.g., MongoDB URI, JWT secret)
```

---

#### **Frontend**
The frontend is built using **React** with **Vite** for fast development and **TailwindCSS** for styling. It provides a responsive and user-friendly interface for all user roles.

##### **Key Features**
1. **Role-Based Dashboards**:
   - **Admin Dashboard**:
     - View all events categorized by vendors.
     - Manage events (add, edit, delete).
     - View attendees for all events.
   - **Vendor Dashboard**:
     - View all events created by the vendor.
     - Manage events (add, edit, delete).
     - View attendees for their events.
   - **User Dashboard**:
     - View all available events.
     - Register for events.
     - View and manage registered events.

2. **State Management**:
   - **Zustand** is used for managing authentication and user state.

3. **API Integration**:
   - **Axios** is used for making API calls to the backend.

4. **Notifications**:
   - **Mantine Notifications** for success and error messages.

##### **Frontend Directory Structure**
```
frontend/
├── src/
│   ├── components/      # Reusable UI components (e.g., Sidebar, Header)
│   ├── pages/           # Pages for different routes (e.g., Dashboard, Events)
│   ├── store/           # Zustand store for state management
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Entry point for the frontend
│   ├── styles.css       # Global styles
├── public/              # Static assets (e.g., images, icons)
├── vite.config.js       # Vite configuration
```

---

### **4. Key Functionalities**

#### **Admin Module**
- **Dashboard**:
  - View all events categorized by vendors.
  - View attendees for all events.
- **Event Management**:
  - Add, edit, or delete any event.
- **Vendor Management**:
  - View vendors and their associated events.

#### **Vendor Module**
- **Dashboard**:
  - View all events created by the vendor.
  - View attendees for their events.
- **Event Management**:
  - Add, edit, or delete events.

#### **User Module**
- **Dashboard**:
  - View all available events.
  - Register for events.
- **Registered Events**:
  - View and manage registered events.

---

### **5. Technologies Used**

#### **Backend**
- **Node.js**: Server-side runtime.
- **Express.js**: Web framework.
- **MongoDB**: NoSQL database.
- **Mongoose**: ODM for MongoDB.
- **JWT**: Authentication.
- **dotenv**: Environment variable management.

#### **Frontend**
- **React**: Frontend library.
- **Vite**: Build tool.
- **TailwindCSS**: Styling.
- **Mantine**: UI components and notifications.
- **Axios**: API integration.
- **Zustand**: State management.

---

### **6. Deployment**
- **Backend**:
  - Hosted on a cloud platform (e.g., AWS, Heroku).
  - Environment variables managed using .env files.
- **Frontend**:
  - Deployed using a static hosting service (e.g., Netlify, Vercel).

---

### **7. Future Enhancements**
- **Payment Integration**:
  - Add payment gateways for event registration.
- **Analytics**:
  - Provide detailed analytics for admins and vendors.
- **Venue Management**:
  - Allow vendors to manage venues for their events.
- **Notifications**:
  - Add email and SMS notifications for event updates.

---

### **8. Conclusion**
EventZen is a robust and scalable platform designed to simplify event management for admins, vendors, and users. With its intuitive interface and powerful backend, it ensures a seamless experience for all stakeholders.




hifi wireframe FIGMA Design:-https://www.figma.com/design/VWHfmIRWkW0vnRp3jdvXKp/eventZen(deloitte-capstone)?node-id=0-1&t=Fbe1N39i6V2ZeXY9-1

lowfi wireframe :- https://www.figma.com/design/mumOtPDVDTAL1At8obkPFT/low-fi-wirefram?node-id=0-1&t=68VP4ykcgq8f69bd-1
