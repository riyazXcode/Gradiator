import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import cgpalogo from 'url:../../public/assets/cgpacalclogo.svg';

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header />

            <main className="flex-grow">
                <div className="p-4 sm:p-6 max-w-9xl mx-auto">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tools & Utilities</h2>

                    <div className="w-full max-w-md bg-white shadow-xl rounded-2xl overflow-hidden">
                        <figure className="w-full h-48 sm:h-56 overflow-hidden bg-white flex items-center justify-center">
                            <img
                                src={cgpalogo}
                                alt="CGPA Calculator"
                                className="object-contain h-full w-full"
                            />
                        </figure>

                        <div className="p-6 sm:p-8">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">CGPA Calculator</h3>
                            <p className="text-gray-600 text-base mb-6">
                                Calculate your CGPA semester-wise using Gradiator.
                            </p>
                            <button
                                onClick={() => navigate('/cgpacalculator')}
                                className="w-full bg-purple-700 text-white font-semibold py-3 rounded-lg hover:bg-purple-800 active:scale-95 transition-transform"
                            >
                                Try Now!
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Dashboard;
