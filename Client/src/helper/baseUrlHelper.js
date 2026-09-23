export const allRouters = [
    //Public Routes
    {
        path : "/login",
        element : Login,
        isPrivate : false
    },
    {
        path : "/reg",
        element : Registration,
        isPrivate : false
        
    }, 
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