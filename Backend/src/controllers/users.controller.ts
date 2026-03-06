import {Request, Response} from "express";
import * as usersService from '../services/users.service'

export const getAllUsers = (req: Request, res: Response) => {
    const users = usersService.getAllUsers();
    res.status(200).json(users);
};

export const createUser = (req: Request, res: Response) => {
    try {
        const newUser = usersService.createUser(req.body);
        res.status(201).json(newUser);
    } catch (error: any) {
        if (error.name === 'VALIDATION_ERROR') {
            res.status(400).json({error: error.message});
        } else {
            res.status(500).json({error: "Internal Server Error"});
        }
    }
};


export const updateUser = (req: Request, res: Response) => {
    try{
        const id = req.params.id as string;
        const updatedUser  = usersService.updateUser(id, req.body);
        res.status(200).json(updatedUser);
    } catch (error: any) {
        if (error.name === 'NOT_FOUND') {
            res.status(404).json({error: "Not Found"});
        } else if (error.name === 'VALIDATION_ERROR') {
            res.status(400).json({error: error.message});
        } else {
            res.status(500).json({error: "Internal Server Error"});
        }
    }
};

export const deleteUser = (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        usersService.deleteUser(id);
        res.status(204).send();
    } catch (error: any) {
        if (error.name === 'NOT_FOUND') {
            res.status(404).json({error: "Not Found"});
        } else {
            res.status(500).json({error: "Internal Server Error"});
        }
    }
};