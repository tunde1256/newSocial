const express = require('express');
const User = require('../model/auth');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

exports.update = async (req, res) => {
    const { userId, isAdmin, password } = req.body;
    const idToUpdate = req.params.id;

    // Log the ID being used for the update
    console.log('Updating user with id:', idToUpdate);

    // Check if the user is authorized to update the profile
    if (userId !== idToUpdate && !isAdmin) {
        return res.status(403).json({ message: 'Not authorized to update this user' });
    }

    // Validate the format of the id
    if (!mongoose.Types.ObjectId.isValid(idToUpdate)) {
        return res.status(400).json({ message: 'Invalid user ID format' });
    }

    // If password is being updated, hash it before saving
    if (password) {
        try {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(password, salt);
        } catch (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    try {
        // Directly query the database before updating
        const user = await User.findById(idToUpdate);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Proceed with the update
        const updatedUser = await User.findByIdAndUpdate(
            idToUpdate,
            { $set: req.body },
            { new: true }
        );

        return res.json(updatedUser);
    } catch (err) {
        console.error('Error updating user:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.getUser = async (req, res) => {

    try{
        const user = await User.findById(req.params.id)
res.status(200).json({user: user});
if(!user){
    res.status(404).json({message:'user not found'});
}

    } catch (err) {
res.status(500).json({message: err.message});
    }
}

exports.follow = async (req, res) => {
    try {
        const userId = req.body.userId;
        const followId = req.params.id;

        // Check if the user is trying to follow themselves
        if (userId === followId) {
            return res.status(400).json({ message: "You can't follow yourself" });
        }

        // Find both the user and the user to follow
        const user = await User.findById(userId);
        const userToFollow = await User.findById(followId);

        // Check if both users exist
        if (!user || !userToFollow) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user already follows the other user
        if (user.followings.includes(followId)) {
            return res.status(400).json({ message: 'You already follow this user' });
        }

        // Add the user to the following list and add the current user to the followers list of the other user
        user.followings.push(followId);
        userToFollow.followers.push(userId);

        // Save both users
        await user.save();
        await userToFollow.save();
        console.log('userId:', userId);
        console.log('followId:', followId);
        
        res.status(200).json({ message: 'User followed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.unfollow = async function(req, res) {
    try {
        // Find the target user (the one to be unfollowed) and the current user (who is unfollowing)
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);

        if (!user || !currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the current user is actually following the target user
        if (user.followers.includes(req.body.userId)) {
            // Remove the current user ID from the followers array of the target user
            await user.updateOne({ $pull: { followers: req.body.userId } });
            // Remove the target user ID from the following array of the current user
            await currentUser.updateOne({ $pull: { following: req.params.id } });

            res.status(200).json({ message: 'User unfollowed successfully' });
        } else {
            res.status(400).json({ message: 'You are not following this user' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


exports.getAlluser = async function (req, res){
    try {
        const user = await User.find().sort({ createdAt: -1 });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

