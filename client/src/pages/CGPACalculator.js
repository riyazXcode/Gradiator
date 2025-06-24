import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { calculateSGPA, calculateCGPA } from '../utils/cgpaUtils';
import Header from '../components/Header';
import { generateCGPAPdf } from '../utils/pdfUtils';

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
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSemesters(cgpaRes.data?.semesters || [
                    { semesterNumber: 1, subjects: [{ name: '', grade: '', credit: '' }] }
                ]);
            } catch (err) {
                console.error('Error fetching CGPA:', err);
            }

            try {
                const profileRes = await axios.get(`${process.env.ROOT_URL_BACKEND}/api/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
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
                subjects: [{ name: '', grade: '', credit: '' }]
            }
        ]);
    };

    const addSubject = (semIndex) => {
        const updated = [...semesters];
        updated[semIndex].subjects.push({ name: '', grade: '', credit: '' });
        setSemesters(updated);
    };

    const updateSubject = (semIndex, subIndex, field, value) => {
        const updated = [...semesters];
        updated[semIndex].subjects[subIndex][field] = value;
        setSemesters(updated);
    };

    const removeSubject = (semIndex, subIndex) => {
        const updated = [...semesters];
        updated[semIndex].subjects.splice(subIndex, 1);
        setSemesters(updated);
    };

    const saveCGPA = () => {
        axios.post(`${process.env.ROOT_URL_BACKEND}/api/cgpa/save`, { semesters }, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(() => {
            setMessage('Saved successfully!');
        }).catch(() => {
            setMessage('Error saving data.');
        });
    };

    const handleDownload = () => {
        const profile = {
            name: formData.name,
            department: formData.department,
            yearOfPassing: formData.yop,
            college: formData.collegename
        };
        generateCGPAPdf(profile, semesters);
    };

    return (
        <div>
            <Header />
            <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
                <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">CGPA Calculator</h1>

                {semesters.map((sem, semIndex) => (
                    <div key={semIndex} className="mb-8 border p-4 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Semester {sem.semesterNumber}</h2>

                        {sem.subjects.map((sub, subIndex) => (
                            <div key={subIndex} className="grid grid-cols-12 gap-4 mb-4 items-center">
                                <input
                                    type="text"
                                    value={sub.name ?? ""}
                                    placeholder="Subject Name"
                                    onChange={e => updateSubject(semIndex, subIndex, 'name', e.target.value)}
                                    className="col-span-4 px-3 py-2 border rounded-md"
                                />
                                <select
                                    value={sub.grade ?? ""}
                                    onChange={e => updateSubject(semIndex, subIndex, 'grade', e.target.value)}
                                    className="col-span-3 px-3 py-2 border rounded-md"
                                >
                                    <option value="">Grade</option>
                                    {gradeOptions.map(g => (
                                        <option key={g} value={g}>{g}</option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    value={sub.credit ?? ""}
                                    placeholder="Credit"
                                    onChange={e =>
                                        updateSubject(semIndex, subIndex, 'credit', e.target.value ? parseInt(e.target.value) : '')
                                    }
                                    className="col-span-3 px-3 py-2 border rounded-md"
                                />
                                {sem.subjects.length > 1 && (
                                    <button
                                        onClick={() => removeSubject(semIndex, subIndex)}
                                        className="text-red-600 text-lg font-bold"
                                    >
                                        ✖
                                    </button>
                                )}
                            </div>
                        ))}

                        <div className="flex justify-between items-center mt-4">
                            <button
                                onClick={() => addSubject(semIndex)}
                                className="text-sm bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"
                            >
                                Add Subject
                            </button>
                            <div className="text-grey-700 font-bold">
                                GPA: {calculateSGPA(sem.subjects)}
                            </div>
                        </div>
                    </div>
                ))}

                <div className="flex justify-between mt-6">
                    <button
                        onClick={addSemester}
                        className={`px-6 py-3 rounded-lg text-white ${semesters.length >= 8 ? 'bg-gray-300 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
                        disabled={semesters.length >= 8}
                    >
                        Add Semester
                    </button>
                    <div className="text-2xl font-bold text-purple-700">
                        CGPA: {calculateCGPA(semesters)}
                    </div>
                </div>

                <div className="mt-6 text-right">
                    <button
                        onClick={saveCGPA}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                    >
                        Save Progress
                    </button>
                    <button
                        onClick={handleDownload}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 ml-4"
                    >
                        Download PDF
                    </button>
                </div>

                {message && <p className="mt-4 text-center text-blue-600">{message}</p>}
            </div>
        </div>
    );
};

export default CGPACalculator;
