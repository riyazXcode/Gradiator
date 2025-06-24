const Profile = require('../models/Profile');

exports.getProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user._id });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.saveProfile = async (req, res) => {
    try {
        const { name, department, yop, collegename } = req.body;

        const profileData = {
            user: req.user._id,
            name,
            department,
            yop,
            collegename
        };

        const existing = await Profile.findOne({ user: req.user._id });

        const profile = existing
            ? await Profile.findOneAndUpdate({ user: req.user._id }, profileData, { new: true })
            : await Profile.create(profileData);

        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
