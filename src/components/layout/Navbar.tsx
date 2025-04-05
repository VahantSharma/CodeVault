
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Code, Github } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Features', path: '/#features' },
  ];
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/80 backdrop-blur-md py-3 shadow-md' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Code className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">Codolio</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  to={link.path}
                  className={`relative px-1 py-2 text-sm font-medium transition-colors 
                    ${location.pathname === link.path ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div 
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                      layoutId="navbar-indicator"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="text-sm font-medium py-2 px-4 rounded-lg transition-colors hover:bg-white/10"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="bg-primary hover:bg-primary/80 text-sm font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </nav>
        
        {/* Mobile Menu Toggle */}
        <button 
          className="block md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          className="md:hidden bg-background/95 backdrop-blur-lg mt-3 border-t border-white/10"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-4 py-4">
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className={`block px-4 py-2 rounded-lg ${
                      location.pathname === link.path 
                        ? 'bg-primary/20 text-white' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="mt-4 flex flex-col gap-3 pt-4 border-t border-white/10">
              <Link 
                to="/login" 
                className="block px-4 py-2 text-center rounded-lg border border-white/20 hover:bg-white/5"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="block px-4 py-2 text-center rounded-lg bg-primary hover:bg-primary/80"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
