import NextAuth from 'next-auth';

interface UserRole {
  id: string;
  name: string;
  permissions: {
    permission: {
      id: string;
      name: string;
    }
  }[];
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      roles: UserRole[];
    }
  }
}