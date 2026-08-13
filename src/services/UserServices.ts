import { hashPassword } from '../auth/password';
import { User, CreateUserInput, UpdateUserInput } from '../types/User';

class UserService {
  private users: User[] = [
  { id: '1', name: 'Elevvo Intern', email: 'intern@elevvo.com', status: 'Active', password: 'password123', role: 'ADMIN' },
  { id: '2', name: 'Esraa Hosni', email: 'esraa@elevvo.com', status: 'Active', password: 'password123', role: 'USER' },
  ];

  private nextId = 4;

  async initPasswords(): Promise<void> {
  for (const user of this.users) {
    user.password = await hashPassword(user.password);
  }
}

  getAll(): User[] {
    return this.users;
  }

  getById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  getByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email);
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
userService.initPasswords();