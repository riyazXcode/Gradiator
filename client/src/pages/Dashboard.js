import React from 'react';
import Header from '../components/Header';
import {useNavigate} from 'react-router-dom';
import cgpalogo from 'url:../../public/assets/cgpacalclogo.png';

const Dashboard = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tools & Utilities</h2>
                <div className="flex flex-col rounded-2xl w-[500px] bg-white shadow-xl">
                    <figure className="flex justify-center items-center rounded-2xl">
                        <img
                            src={cgpalogo}
                            alt="Card Preview"
                            className="rounded-t-2xl"
                        />
                    </figure>

                    <div className="flex flex-col p-8">
                        <div className="text-2xl font-bold text-[#374151] pb-1">CGPA Calculator</div>
                        <div className="text-lg text-[#374151]">
                            Calculate your CGPA with Gradiator.
                        </div>
                        <div className="flex justify-end pt-6">
                            <button
                                onClick={() => navigate('/cgpacalculator')}
                                className="bg-[#7e22ce] text-white w-full font-bold text-base p-3 rounded-lg hover:bg-purple-800 active:scale-95 transition-transform">
                                Try Now!
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
