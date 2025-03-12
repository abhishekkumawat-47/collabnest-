import express from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/userController';

const router = express.Router();

// Get all users
router.get('/', getAllUsers);

// Get single user by ID
router.get('/:id', getUserById);

// Create a new user
router.post('/', createUser);
// const handleCreateUser = async () => {
//     const response = await fetch('/api/users', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             username: 'UserName',
//             name: 'New User',
//             email: 'email',
//             roll: 'roll',
//             degree: 'degree',
//             year: 'year',
//             department: 'department',
//             branch: 'branch',
//             picture: 'picture.jpg',
//             role: 'USER',
//         }),
//     });
//     const result = await response.json();
//     console.log('Updated user:', result);
// };

// Update user by ID
router.put('/:id', updateUser);
// const handleUpdateUser = async () => {
//     const response = await fetch('/api/users/abc123', {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         name: 'Updated Name',
//         email: 'newemail@example.com',
//         role: 'admin',
//       }),
//     });

//     const result = await response.json();
//     console.log('Updated user:', result);
//   };

// Delete user by ID
router.delete('/:id', deleteUser);
// const handleDeleteUser = async () => {
//     const response = await fetch('/api/users/abc123', {
//         method: 'DELETE',
//     });

//     const result = await response.json();
//     console.log('Deleted user response:', result);
// };

export default router;
