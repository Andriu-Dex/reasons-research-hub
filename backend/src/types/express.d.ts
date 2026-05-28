declare global {
  namespace Express {
    interface Request {
      tenant?: {
        id: string;
        slug: string;
        name?: string;
        primaryDomain?: string | null;
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
