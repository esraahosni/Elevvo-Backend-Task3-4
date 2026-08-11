export interface User {
  id: string;
  name: string;
  email: string;
  status: 'Active' | 'Inactive';
}

export type CreateUserInput = Omit<User, 'id'>;
export type UpdateUserInput = Partial<CreateUserInput>;