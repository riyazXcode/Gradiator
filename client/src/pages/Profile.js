import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import Header from "../components/Header";
import Footer from "../components/Footer";

const Profile = () => {
    const [formData, setFormData] = useState({
        name: "",
        department: "",
        yop: "",
        collegename: "",
    });

    const [originalData, setOriginalData] = useState({});
    const [editingField, setEditingField] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axios.get(`${process.env.ROOT_URL_BACKEND}/api/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setFormData({
                    name: data.name || "",
                    department: data.department || "",
                    yop: data.yop || "",
                    collegename: data.collegename || ""
                });

                setOriginalData(data);
            } catch (err) {
                setMessage("Failed to load profile.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleEdit = (field) => setEditingField(field);

    const handleCancel = () => {
        setFormData({ ...formData, [editingField]: originalData[editingField] });
        setEditingField(null);
    };

    const handleSave = async () => {
        try {
            const { data } = await axios.post(
                `${process.env.ROOT_URL_BACKEND}/api/profile`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            setOriginalData(data);
            setEditingField(null);
            setMessage("Profile updated successfully.");
        } catch (err) {
            setMessage("Failed to update profile.");
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (loading) {
        return <div className="text-center mt-10 text-gray-500 text-lg animate-pulse">Loading profile...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />

            <main className="flex-grow">
                <div className="max-w-4xl mx-auto mt-12 px-4 relative">
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-4 right-4 bg-white p-2 shadow-sm border border-gray-200 rounded-full hover:bg-blue-50 transition"
                    >
                        <ArrowLeftIcon className="h-5 w-5 text-blue-600" />
                    </button>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">{formData.name || "Student Name"}</h1>
                        <p className="text-sm text-gray-500 mt-1">{formData.collegename || "College Name"}</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        {message && (
                            <p className="mb-5 px-4 py-2 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm">
                                {message}
                            </p>
                        )}

                        <div className="space-y-5">
                            {["name", "department", "yop", "collegename"].map((field) => (
                                <EditableField
                                    key={field}
                                    label={labelMap[field]}
                                    name={field}
                                    value={formData[field]}
                                    isEditing={editingField === field}
                                    onEdit={() => handleEdit(field)}
                                    onChange={handleChange}
                                    onSave={handleSave}
                                    onCancel={handleCancel}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

const labelMap = {
    name: "Name",
    department: "Department",
    yop: "Year of Passing",
    collegename: "College Name",
};

const EditableField = ({
                           label,
                           name,
                           value,
                           isEditing,
                           onEdit,
                           onChange,
                           onSave,
                           onCancel,
                       }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-4">
            <div className="text-gray-700 font-medium w-40">{label}</div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full">
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            name={name}
                            value={value}
                            onChange={onChange}
                            className="border border-gray-300 px-3 py-2 rounded-md w-full sm:w-60 text-sm"
                        />
                        <button
                            onClick={onSave}
                            className="text-green-600 text-sm font-semibold hover:opacity-70 transition duration-400"
                        >
                            Save
                        </button>
                        <button
                            onClick={onCancel}
                            className="text-red-600 text-sm font-semibold hover:opacity-70 transition duration-400"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <div className="text-gray-900 text-sm w-full sm:w-60">
                            {value || "Not set"}
                        </div>
                        <button
                            onClick={onEdit}
                            className="text-blue-600 text-sm font-semibold hover:opacity-70 transition duration-400"
                        >
                            Edit
                        </button>
                    </>
                )}
            </div>

        </div>

    );
};

export default Profile;
