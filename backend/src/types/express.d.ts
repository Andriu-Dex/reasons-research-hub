declare global {
  namespace Express {
    interface Request {
      tenant?: {
        id: string;
        slug: string;
      };
      admin?: {
        id: string;
        organizationId: string | null;
        role: 'SUPER_ADMIN' | 'ORG_ADMIN';
      };
    }
  }
}

export {};
