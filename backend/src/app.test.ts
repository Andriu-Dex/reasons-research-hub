import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const prismaMock = {
  organization: {
    findFirst: vi.fn()
  },
  researchLine: {
    findMany: vi.fn()
  }
};

vi.mock('./lib/prisma.js', () => ({
  prisma: prismaMock
}));

process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.JWT_ACCESS_SECRET = 'test-access-secret-with-enough-length';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-with-enough-length';
process.env.FRONTEND_URL = 'http://localhost:4200';

const { createApp } = await import('./app.js');
const { publicService } = await import('./modules/public/public.service.js');

describe('REASONS API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('responds to health checks', async () => {
    const response = await request(createApp()).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('resolves the current tenant by custom domain', async () => {
    prismaMock.organization.findFirst.mockResolvedValue({
      id: 'org-1',
      slug: 'tenant-one',
      name: 'Tenant One',
      primaryDomain: 'tenant.example.com'
    });

    const response = await request(createApp()).get('/api/tenant/current').set('Host', 'tenant.example.com');

    expect(response.status).toBe(200);
    expect(response.body.slug).toBe('tenant-one');
    expect(prismaMock.organization.findFirst).toHaveBeenCalledWith({
      where: { primaryDomain: 'tenant.example.com', status: 'ACTIVE' },
      select: { id: true, slug: true, name: true, primaryDomain: true }
    });
  });

  it('filters public research lines by organization and published status', async () => {
    prismaMock.researchLine.findMany.mockResolvedValue([]);

    await publicService.getResearchLines('org-1');

    expect(prismaMock.researchLine.findMany).toHaveBeenCalledWith({
      where: { organizationId: 'org-1', status: 'PUBLISHED' },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }]
    });
  });
});
