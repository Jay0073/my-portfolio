import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAdminAuth } from "./hooks/useAdminAuth";
import { ContentProvider } from "./lib/contentContext";
import { SectionLoader } from "./pages/SitePage";

const SitePage = lazy(() => import("./pages/SitePage"));
const PreviewPage = lazy(() => import("./pages/PreviewPage"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminEditor = lazy(() => import("./pages/AdminEditor"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[rgb(26,26,26)]">
    <div className="animate-spin w-8 h-8 border-2 border-[#61DAB3] border-t-transparent rounded-full" />
  </div>
);

const SiteRoute: React.FC = () => (
  <ContentProvider>
    <Suspense fallback={<PageLoader />}>
      <SitePage />
    </Suspense>
  </ContentProvider>
);

const ProtectedAdminRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) return <PageLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <AdminEditor />
    </Suspense>
  );
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={
          <Suspense fallback={<SectionLoader height="min-h-screen" />}>
            <SiteRoute />
          </Suspense>
        } />
        <Route path="/preview" element={
          <Suspense fallback={<PageLoader />}>
            <PreviewPage />
          </Suspense>
        } />
        <Route path="/admin" element={
          <Suspense fallback={<PageLoader />}>
            <AdminLogin />
          </Suspense>
        } />
        <Route path="/admin/editor" element={<ProtectedAdminRoute />} />
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
