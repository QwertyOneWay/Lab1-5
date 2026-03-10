import { Request, Response, NextFunction } from "express";
import * as usersService from '../services/users.service'

export const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = usersService.getAllUsers();
        res.status(200).json(users);
    } catch (error) { next(error); }
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        const user = usersService.getUserById(id);
        res.status(200).json(user);
    } catch (error) { next(error); }
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        const newUser = usersService.createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) { next(error); }
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        const updatedUser = usersService.updateUser(id, req.body);
        res.status(200).json(updatedUser);
    } catch (error) { next(error); }
};

export const deleteUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        usersService.deleteUser(id);
        res.status(204).send();
    } catch (error) { next(error); }
};