export interface User {
  id: string;
  name: string;
  email: string;
  status: 'Active' | 'Inactive';
  password: string;
  role: 'ADMIN' | 'USER';
}

export type CreateUserInput = Omit<User, 'id'>;
export type UpdateUserInput = Partial<CreateUserInput>;