import { Request, Response } from 'express';
import prisma from '../config/prismaClient.ts';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    const { name, email, ...rest } = req.body;
    try {
        const newUser = await prisma.user.create({
            data: { name, email, ...rest },
        });
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, ...rest } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { name, email, ...rest },
        });
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({ where: { id } });
        res.status(204).send(); // No Content
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};
