import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import UserHomePage from "@/pages/UserHomePage";
import ProfilePage from "@/pages/ProfilePage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import AuthPage from "@/pages/AuthPage";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { TrainingSessionsProvider } from "@/context/TrainingSessionsContext";
import { FeedbackProvider } from "@/context/FeedbackContext";
import { SubmissionsProvider } from "@/context/SubmissionsContext";
import { FloatingActions, ScrollToTop } from "@/components";
import type { Role } from "@/types/dtr";

// Mock user for demo mode
const MOCK_USERS: Record<Role, { id: string; email: string; name: string; role: Role }> = {
  user: { id: 'u1', email: 'an.nguyen@dongtayland.vn', name: 'Lai Ngọc Tuyền', role: 'user' },
};

// Auth route - accessible when NOT authenticated
function AuthRoutes() {
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleAuthenticated(roleOrCredentials: Role | { email: string; password: string }) {
    // Quick login (demo mode) - role only
    if (typeof roleOrCredentials === 'string') {
      const mockUser = MOCK_USERS[roleOrCredentials] || MOCK_USERS.user;
      // Store mock token and user in localStorage
      localStorage.setItem('dtr_token', `demo-token-${mockUser.id}`);
      localStorage.setItem('dtr_mock_user', JSON.stringify(mockUser));
      // Force auth check to pick up the mock user
      window.location.reload();
      return;
    }

    // Real login with credentials
    try {
      await login(roleOrCredentials);
      navigate("/");
    } catch {
      // Login failed - stay on auth page
    }
  }

  return <AuthPage onAuthenticated={handleAuthenticated} />;
}

// Protected routes - require authentication
function ProtectedLayout() {
  return (
    <SubmissionsProvider>
      <TrainingSessionsProvider>
        <FeedbackProvider>
          <Outlet />
          <FloatingActions />
        </FeedbackProvider>
      </TrainingSessionsProvider>
    </SubmissionsProvider>
  );
}

function AppShell() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-1)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
          <span className="text-[var(--text-secondary)]">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth route - accessible when NOT authenticated */}
      <Route
        path="/auth"
        element={
          isAuthenticated ? (
            <Navigate to="/" replace />
          ) : (
            <AuthRoutes />
          )
        }
      />

      {/* Protected routes - require authentication */}
      <Route
        element={
          isAuthenticated ? (
            <ProtectedLayout />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      >
        <Route path="/" element={<UserHomePage />} />
        <Route path="/ranking" element={<LeaderboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AuthProvider>
            <AppShell />
          </AuthProvider>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}
