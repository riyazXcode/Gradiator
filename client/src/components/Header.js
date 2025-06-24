import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import logo from 'url:../../public/assets/g1.svg';

const Header = () => {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleLogoClick = ()=>{
        navigate('/dashboard')
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="w-full flex items-center justify-between bg-white shadow px-6 py-4 relative">
            <div>
                <img onClick={handleLogoClick} src={logo} alt="Gradiator Logo" className="h-10 w-10 aspect-square cursor-pointer" />
            </div>

            <div className="relative" ref={dropdownRef}>
                <button onClick={() => setDropdownOpen(!dropdownOpen)}>
                    <UserCircleIcon className="h-10 w-10 text-gray-600 hover:text-violet-900 duration-300" />
                </button>

                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 ">
                        <button
                            onClick={() => {
                                setDropdownOpen(false);
                                navigate('/profile');
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Profile
                        </button>
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:rounded-lg"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
