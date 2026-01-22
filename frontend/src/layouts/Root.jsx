import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'

const Root = () => {
  return (
    <div>
      <div className="absolute top-0 w-full ">
        <Navbar />
      </div>
      <div className='pt-[70px]'>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default Root