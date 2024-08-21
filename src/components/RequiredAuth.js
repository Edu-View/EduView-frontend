import { useLocation,Navigate,Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequiredAuth=({allowedRoles})=>{
    const{auth}= useAuth()
    const location = useLocation()
    return(
        auth?.roles===allowedRoles
        ?<Outlet/>
        :<Navigate to="/" state={{from:location}} replace/>
    )
}

export default RequiredAuth