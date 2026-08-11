import { User, CreateUserInput, UpdateUserInput } from '../types/User';

class UserService {
  private users: User[] = [
    { id: '1', name: 'Elevvo Intern', email: 'intern@elevvo.com', status: 'Active' },
    ];

  private nextId = 4;

  getAll(): User[] {
    return this.users;
  }

  getById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  create(input: CreateUserInput): User {
    const newUser: User = { id: String(this.nextId++), ...input };
    this.users.push(newUser);
    return newUser;
  }

  update(id: string, input: UpdateUserInput): User | undefined {
    const user = this.getById(id);
    if (!user) return undefined;
    Object.assign(user, input);
    return user;
  }

  delete(id: string): boolean {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }
}
export const userService = new UserService();