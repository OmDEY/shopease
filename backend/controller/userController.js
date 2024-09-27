const User = require('../models/User');

const fetchAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const users = await User.find().sort({ createdAt: -1 }).limit(limit).skip((page - 1) * limit);
        return res.status(200).json({ users });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    fetchAllUsers
}