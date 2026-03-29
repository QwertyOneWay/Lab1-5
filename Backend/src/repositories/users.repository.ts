import {run, all, get} from "../db/dbClient";

export interface User {
  id: string;
  userFullName: string;
  userEmail: string;
  userCourse: number;
  createdAt: string;
}


export const getAllUsers = async (): Promise<User[]> => {
  return await all<User>("SELECT * FROM Users;");
};

export const getUserById = async (id: string): Promise<User | undefined> => {
  return await get<User>(`SELECT * FROM Users WHERE id = '${id}';`);
};

export const addUser = async (user: User): Promise<User> => {

  //vrazlivist
  await run(`
  INSERT INTO Users(id, userFullName, userEmail, userCourse, createdAt)
  VALUES ('${user.id}', '${user.userFullName}', '${user.userEmail}', ${user.userCourse}, '${user.createdAt}');
  `);
  return user;
};

export const updateUser = async ( id: string, updatedData: Partial<User>): Promise<User | null> => {
  const existingUser = await getUserById(id);
  if (!existingUser) return null;

  const merged =  { ...existingUser, ...updatedData };

  await run(`
    UPDATE Users
    SET userFullName = '${merged.userFullName}',
        userEmail = '${merged.userEmail}',
        userCourse = '${merged.userCourse}'
    WHERE id = '${id}';
  `);
  return merged;
}

export const deleteUser = async (id: string): Promise<boolean> => {
  const result = await run(`DELETE FROM Users WHERE id = '${id}';`);
  return result.changes > 0;
};
