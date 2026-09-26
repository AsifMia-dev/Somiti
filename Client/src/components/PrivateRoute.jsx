import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { SomitiContext } from "../context/SomitiContext";

const PrivateRoute = ({children}) => {
    const {user} = useContext(AuthContext);
    const {somiti} = useContext(SomitiContext)

    if(!user){
        return <Navigate to ="/login" replace/>;
    }else if(!somiti){
        return <Navigate to ="/onboarding-wizard" replace />
    }
    return children;

} 

export default PrivateRoute;