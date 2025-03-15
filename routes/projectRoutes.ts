import express from 'express';
import {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
} from '../controllers/projectController';

const router = express.Router();

// Get all projects
router.get('/', getAllProjects);

// Get a single project by ID
router.get('/:id', getProjectById);

// Create a new project
router.post('/', createProject);

// Update a project by ID
router.put('/:id', updateProject);

// Delete a project by ID
router.delete('/:id', deleteProject);

export default router;
