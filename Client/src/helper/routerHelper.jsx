import AuthPage from "../pages/AuthPage"
import OnboardingWizard from "../pages/OnboardingWizard";
import PrivateRoute from "../components/PrivateRoute";
export const allRouters = [
    //Public Routes
    {
        path : "/auth",
        element : AuthPage,
        isPrivate : false
    },

    // Private routes
    {
        path:"/onboarding-wizard",
        element:OnboardingWizard,
        isPrivate : true,
    }
   
];

export const renderRouterElement = (route) =>{
    if(route.isPrivate){
        return (
            <PrivateRoute role={route.role}>
                <route.element />
            </PrivateRoute>
        )
    }
            
    return <route.element />
}