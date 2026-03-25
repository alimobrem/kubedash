import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { AppShell } from './components/AppShell';
import { ToastProvider } from './components/Toast';
import { CostPage } from './pages/CostPage';
import { EnvironmentMatrixPage } from './pages/EnvironmentMatrixPage';
import { MaturityPage } from './pages/MaturityPage';
import { MyServicesPage } from './pages/MyServicesPage';
import { NewServicePage } from './pages/NewServicePage';
import { NodesPage } from './pages/NodesPage';
import { TriagePage } from './pages/TriagePage';

// Root layout with AppShell + ToastProvider
const rootRoute = createRootRoute({
  component: () => (
    <ToastProvider>
      <AppShell>
        <Outlet />
      </AppShell>
    </ToastProvider>
  ),
});

// Placeholder for pages not yet built
const placeholder = (title: string) =>
  function PlaceholderPage() {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold text-[var(--text-primary)]">{title}</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-2">Coming soon...</p>
      </div>
    );
  };

// Routes
const routes = [
  createRoute({ getParentRoute: () => rootRoute, path: '/', component: MyServicesPage }),
  createRoute({ getParentRoute: () => rootRoute, path: '/triage', component: TriagePage }),
  createRoute({ getParentRoute: () => rootRoute, path: '/nodes', component: NodesPage }),
  createRoute({ getParentRoute: () => rootRoute, path: '/cost', component: CostPage }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/deploy',
    component: EnvironmentMatrixPage,
  }),
  createRoute({ getParentRoute: () => rootRoute, path: '/new-service', component: NewServicePage }),
  createRoute({ getParentRoute: () => rootRoute, path: '/maturity', component: MaturityPage }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/overview',
    component: placeholder('Cluster Overview'),
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/services',
    component: placeholder('All Services'),
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/topology',
    component: placeholder('Topology'),
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/networking',
    component: placeholder('Networking'),
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/storage',
    component: placeholder('Storage'),
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/configuration',
    component: placeholder('Configuration'),
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/security',
    component: placeholder('Security'),
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/reliability',
    component: placeholder('Reliability & SLOs'),
  }),
  createRoute({ getParentRoute: () => rootRoute, path: '/logs', component: placeholder('Logs') }),
];

const routeTree = rootRoute.addChildren(routes);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
