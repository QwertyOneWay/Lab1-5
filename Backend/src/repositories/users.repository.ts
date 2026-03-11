export interface User {
  id: string;
  userFullName: string;
  userEmail: string;
  userCourse: number;
  createdAt: string;
}

let users: User[] = [];

export const getAllUsers = (): User[] => {
  return users;
};

export const getUserById = (id: string): User | undefined => {
  return users.find((user) => user.id === id);
};

export const addUser = (user: User) => {
  users.push(user);
  return user;
};

export const updateUser = (
  id: string,
  updatedData: Partial<User>,
): User | null => {
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) {
    return null;
  }
  users[index] = { ...users[index], ...updatedData };
  return users[index];
};

export const deleteUser = (id: string) => {
  const initiallength = users.length;
  users = users.filter((user) => user.id === id);
  return users.length !== initiallength;
};
