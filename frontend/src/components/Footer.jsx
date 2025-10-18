import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Made with{' '}
            <span className="text-red-500 animate-pulse">💖</span>
            {' '}from{' '}
            <span className="text-cyan-400 font-semibold">SRj</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;