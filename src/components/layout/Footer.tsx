
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Code } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-black/30 border-t border-white/10 py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Codolio</span>
          </Link>
          <p className="text-gray-400 mb-4">
            Elevate your coding profile and showcase your programming journey.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Github size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
        
        <div className="col-span-1">
          <h3 className="font-bold mb-4">Product</h3>
          <ul className="space-y-2">
            <li><Link to="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
            <li><Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
            <li><Link to="/testimonials" className="text-gray-400 hover:text-white transition-colors">Testimonials</Link></li>
            <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
          </ul>
        </div>
        
        <div className="col-span-1">
          <h3 className="font-bold mb-4">Resources</h3>
          <ul className="space-y-2">
            <li><Link to="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
            <li><Link to="/documentation" className="text-gray-400 hover:text-white transition-colors">Documentation</Link></li>
            <li><Link to="/api" className="text-gray-400 hover:text-white transition-colors">API</Link></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
          </ul>
        </div>
        
        <div className="col-span-1">
          <h3 className="font-bold mb-4">Company</h3>
          <ul className="space-y-2">
            <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
            <li><Link to="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
            <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</Link></li>
            <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto mt-10 pt-5 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Codolio. All rights reserved.</p>
        <div className="mt-4 md:mt-0 flex gap-4">
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link to="/cookies" className="hover:text-white transition-colors">Cookies Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
