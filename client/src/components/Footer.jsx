const Footer = () => {
    return (
        <footer className="bg-gray-100 text-gray-700 py-4 shadow-inner mt-10">
            <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-center md:text-left">
                    © {new Date().getFullYear()} Gradiator. All rights reserved.
                </p>
                <div className="flex gap-4 text-sm">
                    <a
                        href="https://riyazkhan.dev.skylancers.in/"
                        className="hover:text-purple-600 transition-colors"
                    >
                        Built with 🧡 by Mohammed Riyaz Khan
                    </a>
                </div>
            </div>
        </footer>
    );
};


export default Footer;