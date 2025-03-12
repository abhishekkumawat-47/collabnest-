import { Request, Response } from 'express';
import prisma from '../config/prismaClient';

// Get all projects
export const getAllProjects = async (req: Request, res: Response) => {
    try {
        const projects = await prisma.project.findMany();
        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get single project by ID
export const getProjectById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const project = await prisma.project.findUnique({ where: { id } });
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create a new project
export const createProject = async (req: Request, res: Response) => {
    const { title, subheading, description, difficultyTag, requirementTags, projectResources, authorId } = req.body;
    try {
        const newProject = await prisma.project.create({
            data: {
                title,
                subheading,
                description,
                difficultyTag,
                requirementTags,
                projectResources,
                authorId,
            },
        });
        res.status(201).json(newProject);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
};

// Update a project by ID
export const updateProject = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, subheading, description, difficultyTag, requirementTags, projectResources, authorId } = req.body;
    try {
        const updatedProject = await prisma.project.update({
            where: { id },
            data: {
                title,
                subheading,
                description,
                difficultyTag,
                requirementTags,
                projectResources,
                authorId,
            },
        });
        res.json(updatedProject);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Failed to update project' });
    }
};

// Delete a project by ID
export const deleteProject = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.project.delete({ where: { id } });
        res.status(204).send(); // No content
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
};
