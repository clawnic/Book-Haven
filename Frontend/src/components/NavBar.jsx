import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiBars3CenterLeft } from "react-icons/hi2";
import { CiSearch, CiUser, CiHeart } from "react-icons/ci";
import { GiShoppingCart } from "react-icons/gi";
import avatarImg from "../assets/avatar.png";
import { useSelector } from "react-redux";
import { useAuth } from "../context/Auth.context";
import { HiOutlineUser } from "react-icons/hi";

const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Orders", href: "/orders" },
    { name: "Cart Page", href: "/cart" },
    { name: "CheckOut", href: "/checkout" }
];

const NavBar = () => {
    const [isDropDown, setisDropDown] = useState(false);
    const {currentUser,logout} = useAuth();
    const cartItems = useSelector(state => state.cart.cartItems);

    const handleLogOut =()=>{
        logout();
    }
    const token = localStorage.getItem('token');

    return (
        <header className='max-w-screen-2xl mx-auto px-4 py-6'>
            <nav className='flex justify-between items-center'>
                <div className='flex items-center justify-between gap-4 md:gap-16'>
                    <Link to="/">
                        <HiBars3CenterLeft className='size-6' />
                    </Link>

                    <div className='relative sm:w-72 w-40 space-x-2'>
                        <CiSearch className='absolute inline-block left-3 inset-y-2' />
                        <input type="text" placeholder='What are you looking for?' className='bg-[#EAEAEA] w-full py-1 md:px-8 px-6 rounded-md focus:outline-none' />
                    </div>
                </div>

                <div className='relative flex items-center md:space-x-3 space-x-2'>
                    <div>
                        {currentUser ? (
                            <>
                                <button onClick={() => setisDropDown(!isDropDown)}>
                                    <img src={avatarImg} alt="" className={`size-7 rounded-full ${currentUser ? 'ring-2 ring-blue-500' : ''}`} />
                                </button>

                                {isDropDown && (
                                    <div className='absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-40'>
                                        <ul>
                                            {navigation.map((item) => (
                                                <li key={item.name} onClick={() => setisDropDown(false)}>
                                                    <Link to={item.href} className='block px-4 py-2 text-sm hover:bg-gray-100'>
                                                        {item.name}
                                                    </Link>
                                                </li>
                                            ))}

                                            <li>
                                                <button
                                                onClick={handleLogOut}
                                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Logout</button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </>
                        ) : token ?  <Link to="/dashboard" className='border-b-2 border-primary'>Dashboard</Link> : (
                            <Link to="/login"> <HiOutlineUser className="size-6" /></Link>
                        )}
                    </div>

                    <button className="hidden sm:block">
                        <CiHeart className='size-6' />
                    </button>

                    <Link to="/cart" className='bg-primary p-1 sm:px-6 px-2 flex items-center rounded-sm'>
                        <GiShoppingCart className='size-6' />
                        <span className='text-sm sm:ml-1'>{cartItems.length > 9 ? '9+' : cartItems.length}</span>
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default NavBar;