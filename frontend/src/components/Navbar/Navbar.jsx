import React from 'react'

const Navbar = () => {

    const menu_options = ["Home" , "About" , "Blogs" , "Business"];
  return (
    <div className='bg-amber-50 h-10'>
        <ul className='flex flex-row justify-evenly align-middle'>
           {menu_options.map((option , i) =>(
                <li key={i}>{option}</li>
            ))}
        </ul>
    </div>
  )
}

export default Navbar
