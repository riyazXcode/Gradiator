const CGPA = require('../models/CGPA');

const gradeToPoint = (grade) => {
    const map = {
        'O': 10,
        'A+': 9,
        'A': 8,
        'B+': 7,
        'B': 6,
        'C': 5,
        'U': 0,
        'AB': 0,
        'W': 0,
        'WH': 0,
        'SA': 0
    };
    return map[grade] ?? 0;
};

exports.getCGPAData = async (req, res) => {
    try {
        const record = await CGPA.findOne({ userId: req.user.id });
        res.json(record || { semesters: [] });
    } catch (err) {
        console.error('GET /api/cgpa error:', err);
        res.status(500).send('Server Error');
    }
};

exports.saveCGPAData = async (req, res) => {
    const { semesters } = req.body;

    if (!Array.isArray(semesters) || semesters.length > 8) {
        return res.status(400).json({ msg: 'Invalid semesters data (max 8 semesters)' });
    }

    try {
        let record = await CGPA.findOne({ userId: req.user.id });

        if (record) {
            record.semesters = semesters;
            await record.save();
        } else {
            record = new CGPA({ userId: req.user.id, semesters });
            await record.save();
        }

        res.json({ msg: 'Saved successfully' });
    } catch (err) {
        console.error('POST /api/cgpa/save error:', err);
        res.status(500).send('Server Error');
    }
};

exports.calculateCGPA = async (req, res) => {
    try {
        const record = await CGPA.findOne({ userId: req.user.id });

        if (!record) return res.json({ cgpa: 0 });

        let totalPoints = 0;
        let totalCredits = 0;

        record.semesters.forEach(({ subjects }) => {
            subjects.forEach(({ grade, credit }) => {
                const point = gradeToPoint(grade);
                totalPoints += point * credit;
                totalCredits += credit;
            });
        });

        const cgpa = totalCredits === 0 ? 0 : parseFloat((totalPoints / totalCredits).toFixed(2));

        res.json({ cgpa });
    } catch (err) {
        console.error('GET /api/cgpa/calculate error:', err);
        res.status(500).send('Server Error');
    }
};
