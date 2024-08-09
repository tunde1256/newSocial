const Post = require('../model/postmodel');
const User = require('../model/auth');

exports.createpost = async (req, res, next) => {
    try {
        const { userId, desc, img } = req.body;

        // Check if required fields are provided
        if (!userId || !desc) {
            return res.status(400).json({ message: 'userId and desc are required' });
        }

        // Ensure desc is a string before calling match
        const mentions = typeof desc === 'string' ? desc.match(/@\w+/g) || [] : [];
        const mentionUserIds = [];

        // Find user IDs for mentioned usernames
        for (const mention of mentions) {
            const username = mention.slice(1); // Remove the '@' prefix
            const user = await User.findOne({ username });
            if (user) {
                mentionUserIds.push(user._id);
            }
        }

        // Create new post
        const post = new Post({
            userId,
            desc,
            img,
            mentions: mentionUserIds,
        });

        const newpost = await post.save();
        res.status(201).json(newpost);
    } catch (err) {
        console.error('Error creating post:', err.message); // Log the error for debugging
        res.status(500).json({ message: 'Server error' }); // Provide a generic error message
    }
};


exports.getpost = async (req, res) => {
   try{
    const post = await Post.findOne(req.params.userId)
    res.status(200).json(post);
   }catch (err) {
    res. status(500).json({ message: err.message });
   }
}

// Update a pos

exports.updatepost = async (req, res) => {
    try {
        const { desc } = req.body;

        // Check if desc is defined
        if (!desc) {
            return res.status(400).json({ message: 'Description (desc) is required' });
        }

        // Extract mentions from desc
        const mentions = desc.match(/@\w+/g) || [];
        const mentionUserIds = [];

        // Find user IDs for mentioned usernames
        for (const mention of mentions) {
            const username = mention.slice(1); // Remove the '@' prefix
            const user = await User.findOne({ username });
            if (user) {
                mentionUserIds.push(user._id);
            }
        }

        // Update the post with new data and mentions
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { ...req.body, mentions: mentionUserIds },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(updatedPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
exports.likes = async function (req, res, next) {
    try {
        const post = await Post.findById(req.params.id);
        const userId = req.body.userId;
        if (!post.likes.includes(userId)) {
            await post.updateOne({ $push: { likes: userId } });
            res.status(200).json({ message: 'Post has been liked' });
        } else {
            await post.updateOne({ $pull: { likes: userId } });
            res.status(200).json({ message: 'Post has been disliked' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}
// delete post

exports.deletePost = async function (req, res){
    try {
        const post = await Post.findById(req.params.id);

        if (post.userId !== req.body.userId) {
            await post.deleteOne();

              // Fetch the user who deleted the post
            const user = await User.findById(post.userId);
            res.status(200).json({ message: 'Post deleted successfully' });
    }else {
        res.status(403).json({ message: 'You can only delete your own posts' });
    }
}catch (err) {
res.status(500).json({ message:err.message });
}
}

// get all posts
exports.getAllPosts = async function (req, res){
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// get posts by user
exports.getPostsByUser = async function (req, res){
    try {
        const posts = await Post.find({ userId: req.params.id }).sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


exports.comments = async (req, res) => {
    try {
        // Extract userId and comment from the request body
        const { userId, comment } = req.body;
        

        // Ensure both userId and comment are provided
        if (!userId || !comment) {
            return res.status(400).json({ message: 'UserId and comment are required' });
        }

        // Find the post by its ID and push the new comment to the comments array
        const post = await Post.findByIdAndUpdate(
            req.params.id, 
            { $push: { comments: { userId, comment } } }, 
            { new: true }
        );

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json({ message: 'Comment added successfully', post });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};



exports.addComment = async (req, res) => {
    try {
        const { userId, text } = req.body;
        const postId = req.params.id;

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the post by its ID
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Add the comment to the post
        const comment = {
            userId: userId,
            username: user.username,
            text,
            createdAt: new Date(),
        };
        post.comments.push(comment);

        // Save the updated post
        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
    } catch (err) {
        console.error('Error adding comment:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
