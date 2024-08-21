import { Outlet} from "react-router-dom";
    import React from 'react'

const Layout = () => {
  return (
    <div className="App min-h-screen">
      <Outlet/>
    </div>
  )
}

export default Layout 