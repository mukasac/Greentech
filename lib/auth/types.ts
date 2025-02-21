export type UserRole = 'ADMIN' | 'USER' | 'MANAGER';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      role: string;
      permissions: string[];
    }
  }
}