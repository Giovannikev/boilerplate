import "./App.css";
import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { CurrencyProvider } from "./contexts/currencyContext";
import { PrivateRoute } from "./components/auth/privateRoute";
import { PublicRoute } from "./components/auth/publicRoute";
import { ROUTES } from "./constants/routes";

const SignupPage = React.lazy(() => import("./pages/auth/signUp/page"));
const SignInPage = React.lazy(() => import("./pages/auth/signIn/page"));
const ResetPasswordPage = React.lazy(
  () => import("./pages/auth/resetPassword/page")
);
const DashboardPage = React.lazy(() => import("./pages/dashboard/page"));
const SettingsPage = React.lazy(() => import("./pages/dashboard/settings/page"));
const ProfilePage = React.lazy(() => import("./pages/dashboard/profile/page"));
const SectionCards = React.lazy(() =>
  import("./components/dashboard/section-cards").then((m) => ({ default: m.SectionCards }))
);
import { Spinner } from "./components/ui/spinner";
import { Button } from "./components/ui/button";
import { useAuth } from "./hooks/useAuth";
import { withTranslation, type WithTranslation } from "react-i18next";

function HomeRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center" aria-busy>
        <Spinner className="size-8 text-muted-foreground" />
      </div>
    );
  }

  return <Navigate to={user ? ROUTES.DASHBOARD : ROUTES.SIGNIN} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CurrencyProvider>
          <Suspense
            fallback={
              <div className="flex h-screen items-center justify-center" aria-busy>
                <Spinner className="size-8 text-muted-foreground" />
              </div>
            }
          >
            <AppErrorBoundary>
            <Routes>
              <Route path={ROUTES.HOME} element={<HomeRedirect />} />
              <Route
                path={ROUTES.SIGNUP}
                element={
                  <PublicRoute>
                    <SignupPage />
                  </PublicRoute>
                }
              />
              <Route
                path={ROUTES.SIGNIN}
                element={
                  <PublicRoute>
                    <SignInPage />
                  </PublicRoute>
                }
              />
              <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
              <Route
                path={ROUTES.DASHBOARD}
                element={
                  <PrivateRoute>
                    <DashboardPage />
                  </PrivateRoute>
                }
              >
                <Route index element={<SectionCards />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>
            </Routes>
            </AppErrorBoundary>
          </Suspense>
        </CurrencyProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

class AppErrorBoundaryBase extends React.Component<React.PropsWithChildren & WithTranslation, { hasError: boolean }>{
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch() {}
  render() {
    const { t } = this.props;
    if (this.state.hasError) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="text-lg font-medium">{t('errors.app_error')}</div>
            <Button onClick={() => this.setState({ hasError: false })}>{t('errors.retry')}</Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppErrorBoundary = withTranslation()(AppErrorBoundaryBase);
