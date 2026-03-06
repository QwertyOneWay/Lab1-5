import {v4 as uuid} from 'uuid';
import * as usersRepository from '../repositories/users.repository';

export interface CreateUserRequestDto {
    userFullName: string;
    userEmail: string;
    userCourse: number;
}
export type UpdateUserRequestDto = Partial<CreateUserRequestDto>;

export interface UserResponseDto {
    id: string;
    userFullName: string;
    userEmail: string;
    userCourse: number;
    createdAt: string;
}

const mapToResponseDto = (user: usersRepository.User): UserResponseDto => {
    return {
        id: user.id,
        userFullName: user.userFullName,
        userEmail: user.userEmail,
        userCourse: user.userCourse,
        createdAt: user.createdAt
    };
};

export const getAllUsers = (): UserResponseDto[] => {
    return usersRepository.getAllUsers().map(mapToResponseDto);
};

export const getUserById = (id: string): UserResponseDto => {
    const user = usersRepository.getUserById(id);
    if (!user) throw new Error("NOT_FOUND");
    return mapToResponseDto(user);
};

export const createUser = (dto: CreateUserRequestDto): UserResponseDto => {
    if (!dto.userFullName || dto.userFullName.trim().length < 3) {
        throw new Error("VALIDATION_ERROR: Ім'я має бути мінімум 3 символи");
    }
    if (!dto.userEmail || !dto.userEmail.includes('@')) {
        throw new Error("VALIDATION_ERROR: Некоректний email");
    }
    if (!dto.userCourse || dto.userCourse < 1 || dto.userCourse > 6) {
        throw new Error("VALIDATION_ERROR: Курс має бути від 1 до 6");
    }

    const newUser: usersRepository.User = {
        id: uuid(),
        userFullName: dto.userFullName,
        userEmail: dto.userEmail,
        userCourse: dto.userCourse,
        createdAt: new Date().toISOString()
    };

    const savedUser = usersRepository.addUser(newUser);
    return mapToResponseDto(savedUser);
};

export const updateUser = (id: string, dto: UpdateUserRequestDto): UserResponseDto => {
    if (typeof dto.userFullName === 'string' && dto.userFullName.trim().length < 3) {
        throw new Error("VALIDATION_ERROR: Ім'я має бути мінімум 3 символи");
    }
    if (typeof dto.userEmail === 'string' && !dto.userEmail.includes('@')) {
        throw new Error("VALIDATION_ERROR: Некоректний email");
    }
    if (typeof dto.userCourse === 'number' && (dto.userCourse < 1 || dto.userCourse > 6)) {
        throw new Error("VALIDATION_ERROR: Курс має бути від 1 до 6");
    }

    const updatedUser = usersRepository.updateUser(id, dto);
    if (!updatedUser) throw new Error("NOT_FOUND");

    return mapToResponseDto(updatedUser);
};

export const deleteUser = (id: string): boolean => {
    const isDeleted = usersRepository.deleteUser(id);
    if (!isDeleted) throw new Error("NOT_FOUND");
    return true;
};
