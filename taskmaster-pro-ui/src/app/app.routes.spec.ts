import { routes } from './app.routes';

describe('App routes (smoke tests)', () => {
  it('exports a routes array', () => {
    expect(Array.isArray(routes)).toBeTrue();
    expect(routes.length).toBeGreaterThan(0);
  });

  it('has a top-level admin route with children', () => {
    const main = routes.find(r => r.path === '' && !!r.children);
    expect(main).toBeTruthy();

    // find admin child under main.children (defensive)
    const mainChildren = main?.children ?? [];
    const admin = mainChildren.find((c: any) => c.path === 'admin' && Array.isArray(c.children));
    expect(admin).toBeTruthy();
  });

  it('has a fallback route (wildcard)', () => {
    // Look for any wildcard '**' at any level
    const found = (function search(rs: any[]): boolean {
      for (const r of rs) {
        if (r.path === '**') return true;
        if (Array.isArray(r.children) && search(r.children)) return true;
      }
      return false;
    })(routes as any[]);
    expect(found).toBeTrue();
  });
});
