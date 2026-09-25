import RouteComponent from "./routes/routerComponets"
import { Toaster } from "sonner"
import { AuthProvider } from "./context/AuthContext";
function App() {
   return(
    <AuthProvider>
      <Toaster position="top-center" />
      <RouteComponent />
    </AuthProvider>
   )
}

export default App
