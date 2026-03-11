import { v4 as uuid } from "uuid";
import * as usersRepository from "../repositories/users.repository";

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

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

const mapToResponseDto = (user: usersRepository.User): UserResponseDto => {
  return {
    id: user.id,
    userFullName: user.userFullName,
    userEmail: user.userEmail,
    userCourse: user.userCourse,
    createdAt: user.createdAt,
  };
};

export const getAllUsers = (
  queryParams: any = {},
): PaginatedResponse<UserResponseDto> => {
  let users = usersRepository.getAllUsers();

  if (queryParams.search) {
    const query = queryParams.search.toLowerCase();
    users = users.filter(
      (u) =>
        u.userFullName.toLowerCase().includes(query) ||
        u.userEmail.toLowerCase().includes(query),
    );
  }

  users.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const items = users.map(mapToResponseDto);

  return {
    items: items,
    total: items.length,
  };
};

export const getUserById = (id: string): UserResponseDto => {
  const user = usersRepository.getUserById(id);
  if (!user) throw new Error("NOT_FOUND");
  return mapToResponseDto(user);
};

export const createUser = (dto: CreateUserRequestDto): UserResponseDto => {
  const newUser: usersRepository.User = {
    id: uuid(),
    userFullName: dto.userFullName,
    userEmail: dto.userEmail,
    userCourse: dto.userCourse,
    createdAt: new Date().toISOString(),
  };

  const savedUser = usersRepository.addUser(newUser);
  return mapToResponseDto(savedUser);
};

export const updateUser = (
  id: string,
  dto: UpdateUserRequestDto,
): UserResponseDto => {
  const updatedUser = usersRepository.updateUser(id, dto);
  if (!updatedUser) throw new Error("NOT_FOUND");

  return mapToResponseDto(updatedUser);
};

export const deleteUser = (id: string): boolean => {
  const isDeleted = usersRepository.deleteUser(id);
  if (!isDeleted) throw new Error("NOT_FOUND");
  return true;
};
