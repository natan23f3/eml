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
// Temporarily comment out missing pages until they're created
// import Registration from "@/pages/Registration";
import { LoginPage } from "@/components/layout/LoginPage";
import { useAuthContext } from "./providers/AuthProvider";

function Router() {
  const { user, loading } = useAuthContext();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // If not authenticated, show login page
  if (!user) {
    return <LoginPage />;
  }

  return (
    <Switch>
      <Route path="/" component={Dashboard}/>
      <Route path="/students" component={Students}/>
      <Route path="/students/new" component={StudentForm}/>
      <Route path="/students/:id/edit" component={StudentForm}/>
      <Route path="/classes" component={Classes}/>
      {/* <Route path="/registration" component={Registration}/> */}
      <Route path="/finance" component={Finance}/>
      <Route path="/accounting" component={Accounting}/>
      <Route path="/payments" component={Payments}/>
      <Route path="/communications" component={Communications}/>
      <Route path="/reports" component={Reports}/>
      <Route path="/settings" component={Settings}/>
      <Route component={NotFound} />
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
