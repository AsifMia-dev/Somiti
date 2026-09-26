import RouteComponent from "./routes/routerComponets"
import { Toaster } from "sonner"
import { AuthProvider } from "./context/AuthContext";
import { SomitiProvider } from "./context/SomitiContext";

function App() {
   return(
    <AuthProvider>
      <SomitiProvider>
        <Toaster position="top-center" />
        <RouteComponent />
      </SomitiProvider>
    </AuthProvider>
   )
}

export default App
