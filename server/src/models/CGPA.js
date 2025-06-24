const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    name: String,
    grade: String,
    credit: Number,
});

const SemesterSchema = new mongoose.Schema({
    semesterNumber: { type: Number, required: true },
    subjects: [SubjectSchema]
});

const CGPASchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    semesters: [SemesterSchema]
});

module.exports = mongoose.model('CGPA', CGPASchema);
