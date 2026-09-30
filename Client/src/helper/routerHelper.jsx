import AuthPage from "../pages/AuthPage"
import OnboardingWizard from "../pages/OnboardingWizard";
import PrivateRoute from "../components/PrivateRoute";
import DashboardPage from "../pages/DashboardPage";
import SomitiRoute from "../components/SomitiRoute";
import Layout from "../components/layout/Layout";
import AddBorrowerPage from "../pages/AddBorrowerPage";
export const allRouters = [
    //Public Routes
    {
        path : "/",
        element : AuthPage,
        isPrivate : false,
        somiti: false
    },

    // Private routes
    {
        path:"/onboarding-wizard",
        element:OnboardingWizard,
        isPrivate : true,
        somiti: false
    },
    {
        path:"/dashboard",
        element:DashboardPage,
        isPrivate : true,
        somiti: true
    },
    {
        path: "/borrowers/add",
        element: AddBorrowerPage,
        isPrivate: true,
        somiti: true
    }
   
];

export const renderRouterElement = (route) =>{
    if(route.isPrivate && route.somiti){
        return(
            <SomitiRoute>
                <Layout>
                    <route.element />
                </Layout>
            </SomitiRoute>
        )
    }else if(route.isPrivate){
        return (
            <PrivateRoute>
                <route.element />
            </PrivateRoute>
        )
    }

    return <route.element />
}