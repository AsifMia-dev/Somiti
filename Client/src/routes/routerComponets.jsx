import React from 'react'
import { Routes,Route } from 'react-router-dom';


import { allRouters,renderRouterElement } from '../helper/routerHelper';



const RouteComponent = () => {
  return (
      <Routes>
        {
          allRouters.map((route) =>(
            <Route path = {route.path} element={renderRouterElement(route)} />
          ))
        }
      </Routes> 
  )
}

export default RouteComponent;