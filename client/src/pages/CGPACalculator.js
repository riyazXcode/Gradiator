import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { calculateSGPA, calculateCGPA } from '../utils/cgpaUtils';
import Header from '../components/Header';
import { generateCGPAPdf } from '../utils/pdfUtils';
import {
    PlusCircleIcon,
    PlusIcon,
    TrashIcon,
    CheckCircleIcon,
    ArrowDownTrayIcon,
} from '@heroicons/react/24/solid';
import Footer from "../components/Footer";

const gradeOptions = ['O', 'A+', 'A', 'B+', 'B', 'C', 'U', 'AB', 'W', 'WH', 'SA'];

const CGPACalculator = () => {
    const [semesters, setSemesters] = useState([]);
    const [message, setMessage] = useState('');
    const token = localStorage.getItem('token');

    const [formData, setFormData] = useState({
        name: '',
        department: '',
        yop: '',
        collegename: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cgpaRes = await axios.get(`${process.env.ROOT_URL_BACKEND}/api/cgpa/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSemesters(
                    cgpaRes.data?.semesters || [
                        { semesterNumber: 1, subjects: [{ name: '', grade: '', credit: '' }] },
                    ]
                );
            } catch (err) {
                console.error('Error fetching CGPA:', err);
            }

            try {
                const profileRes = await axios.get(`${process.env.ROOT_URL_BACKEND}/api/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFormData(profileRes.data);
            } catch (err) {
                console.error('Error fetching profile:', err);
            }
        };

        fetchData();
    }, []);

    const addSemester = () => {
        if (semesters.length >= 8) return;
        setSemesters(prev => [
            ...prev,
            {
                semesterNumber: prev.length + 1,
                subjects: [{ name: '', grade: '', credit: '' }],
            },
        ]);
    };

    const addSubject = semIndex => {
        const updated = [...semesters];
        updated[semIndex].subjects.push({ name: '', grade: '', credit: '' });
        setSemesters(updated);
    };

    const updateSubject = (semIndex, subIndex, field, value) => {
        const updated = [...semesters];
        if (field === 'credit') {
            const numericValue = parseInt(value);
            updated[semIndex].subjects[subIndex][field] =
                isNaN(numericValue) || numericValue > 10 ? '' : numericValue;
        } else {
            updated[semIndex].subjects[subIndex][field] = value;
        }
        setSemesters(updated);
    };

    const removeSubject = (semIndex, subIndex) => {
        const updated = [...semesters];
        updated[semIndex].subjects.splice(subIndex, 1);
        setSemesters(updated);
    };

    const saveCGPA = () => {
        axios
            .post(`${process.env.ROOT_URL_BACKEND}/api/cgpa/save`, { semesters }, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                setMessage('Saved successfully!');
            })
            .catch(() => {
                setMessage('Error saving data.');
            });
    };

    const handleDownload = () => {
        const profile = {
            name: formData.name,
            department: formData.department,
            yearOfPassing: formData.yop,
            college: formData.collegename,
        };
        generateCGPAPdf(profile, semesters);
    };

    return (
        <div>
            <Header />
            <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg mt-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-6 text-center">
                    CGPA Calculator
                </h1>

                {semesters.map((sem, semIndex) => (
                    <div key={semIndex} className="mb-8 border p-4 rounded-lg shadow-sm bg-gray-50">
                        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">
                            Semester {sem.semesterNumber}
                        </h2>

                        {sem.subjects.map((sub, subIndex) => (
                            <div key={subIndex} className="grid grid-cols-1 sm:grid-cols-12 gap-4 mb-4 items-center">
                                <input
                                    type="text"
                                    value={sub.name ?? ''}
                                    placeholder="Subject Name"
                                    onChange={e => updateSubject(semIndex, subIndex, 'name', e.target.value)}
                                    className="sm:col-span-4 px-3 py-2 border rounded-md w-full"
                                />
                                <select
                                    value={sub.grade ?? ''}
                                    onChange={e => updateSubject(semIndex, subIndex, 'grade', e.target.value)}
                                    className="sm:col-span-3 px-3 py-2 border rounded-md w-full"
                                >
                                    <option value="">Grade</option>
                                    {gradeOptions.map(g => (
                                        <option key={g} value={g}>
                                            {g}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    value={sub.credit ?? ''}
                                    placeholder="Credit"
                                    max={10}
                                    min={1}
                                    onChange={e =>
                                        updateSubject(semIndex, subIndex, 'credit', e.target.value)
                                    }
                                    className="sm:col-span-3 px-3 py-2 border rounded-md w-full"
                                />

                                {sem.subjects.length > 1 && (
                                    <button
                                        onClick={() => removeSubject(semIndex, subIndex)}
                                        className="text-red-600 hover:text-red-800 transition duration-300"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                        ))}

                        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
                            <button
                                onClick={() => addSubject(semIndex)}
                                className="flex items-center gap-2 text-sm bg-white border px-4 py-2 rounded-lg hover:bg-gray-100 transition duration-300"
                            >
                                <PlusIcon className="h-4 w-4 text-gray-700" />
                                Add Subject
                            </button>
                            <div className="text-gray-700 font-semibold">
                                GPA: {calculateSGPA(sem.subjects)}
                            </div>
                        </div>
                    </div>
                ))}

                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                    <button
                        onClick={addSemester}
                        disabled={semesters.length >= 8}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition duration-300 ${
                            semesters.length >= 8
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-purple-600 hover:bg-purple-700'
                        }`}
                    >
                        <PlusCircleIcon className="h-5 w-5" />
                        Add Semester
                    </button>
                    <div className="text-2xl font-bold text-purple-700">
                        CGPA: {calculateCGPA(semesters)}
                    </div>
                </div>

                <div className="mt-6 text-center sm:text-right space-y-3 sm:space-y-0 sm:space-x-4">
                    <button
                        onClick={saveCGPA}
                        className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                    >
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        Save Progress
                    </button>
                    <button
                        onClick={handleDownload}
                        className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                    >
                        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                        Download PDF
                    </button>
                </div>

                {message && (
                    <p className="mt-4 text-center text-blue-600 font-medium">{message}</p>
                )}
            </div>
            <Footer/>
        </div>
    );
};

export default CGPACalculator;
