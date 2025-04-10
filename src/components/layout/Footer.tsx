import React from "react";
import Link from "next/link";
import { FiGithub, FiTwitter, FiLinkedin } from "react-icons/fi";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <nav
          className="-mx-5 -my-2 flex flex-wrap justify-center"
          aria-label="Footer"
        >
          <div className="px-5 py-2">
            <Link
              href="/"
              className="text-base text-gray-500 hover:text-gray-900"
            >
              Home
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link
              href="/about"
              className="text-base text-gray-500 hover:text-gray-900"
            >
              About
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link
              href="/features"
              className="text-base text-gray-500 hover:text-gray-900"
            >
              Features
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link
              href="/pricing"
              className="text-base text-gray-500 hover:text-gray-900"
            >
              Pricing
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link
              href="/contact"
              className="text-base text-gray-500 hover:text-gray-900"
            >
              Contact
            </Link>
          </div>
        </nav>
        <div className="mt-8 flex justify-center space-x-6">
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">GitHub</span>
            <FiGithub className="h-6 w-6" />
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Twitter</span>
            <FiTwitter className="h-6 w-6" />
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">LinkedIn</span>
            <FiLinkedin className="h-6 w-6" />
          </a>
        </div>
        <p className="mt-8 text-center text-base text-gray-400">
          &copy; {new Date().getFullYear()} CourseGPT. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
