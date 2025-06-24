import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-100 text-gray-700 py-6 mt-12 shadow-inner">
            <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-center md:text-left">
                    © {new Date().getFullYear()} Gradiator. All rights reserved.
                </p>
                <div className="flex gap-4 text-sm">
                    <a
                        href="https://github.com/yourusername/gradiator"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-purple-600 transition-colors"
                    >
                        GitHub
                    </a>
                    <a
                        href="/privacy"
                        className="hover:text-purple-600 transition-colors"
                    >
                        Privacy
                    </a>
                    <a
                        href="/terms"
                        className="hover:text-purple-600 transition-colors"
                    >
                        Terms
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
