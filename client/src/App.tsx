import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Students from "@/pages/Students";
import StudentForm from "@/pages/StudentForm";
import Classes from "@/pages/Classes";
import Finance from "@/pages/Finance";
import Accounting from "@/pages/Accounting";
import Payments from "@/pages/Payments";
import Communications from "@/pages/Communications";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import AuthPage from "@/pages/auth-page";
// Temporarily comment out missing pages until they're created
// import Registration from "@/pages/Registration";
import { Layout } from "@/components/layout/Layout";
import { useAuthContext } from "./providers/AuthProvider";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, loading } = useAuthContext();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If not authenticated, redirect to auth page (the redirect happens in the auth page)
  if (!user) {
    return <AuthPage />;
  }

  // If authenticated, render the component inside the layout
  return (
    <Layout>
      <Component />
    </Layout>
  );
}

function Router() {
  const { loading } = useAuthContext();

  // Show loading state while initial auth check
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route path="/">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/students">
        {() => <ProtectedRoute component={Students} />}
      </Route>
      <Route path="/students/new">
        {() => <ProtectedRoute component={StudentForm} />}
      </Route>
      <Route path="/students/:id/edit">
        {() => <ProtectedRoute component={StudentForm} />}
      </Route>
      <Route path="/classes">
        {() => <ProtectedRoute component={Classes} />}
      </Route>
      <Route path="/finance">
        {() => <ProtectedRoute component={Finance} />}
      </Route>
      <Route path="/accounting">
        {() => <ProtectedRoute component={Accounting} />}
      </Route>
      <Route path="/payments">
        {() => <ProtectedRoute component={Payments} />}
      </Route>
      <Route path="/communications">
        {() => <ProtectedRoute component={Communications} />}
      </Route>
      <Route path="/reports">
        {() => <ProtectedRoute component={Reports} />}
      </Route>
      <Route path="/settings">
        {() => <ProtectedRoute component={Settings} />}
      </Route>
      <Route>
        {() => <ProtectedRoute component={NotFound} />}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;
