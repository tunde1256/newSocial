
/**
 * @swagger
 * tags:
 *   - name: Post
 *     description: Operations related to posts
 *   - name: User
 *     description: Operations related to users
 */
const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const postController = require('../controller/post');
const verifyToken = require('../middleware');
const tokengenerator = require('../controller/generattoken');

/**
 * @swagger
 * /api/post:
 *   post:
 *     tags: [Post]
 *     summary: Create a new post
 *     description: Creates a new post with a user ID and description.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - desc
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user creating the post
 *                 example: "60d0fe4f5311236168a109ca"
 *               desc:
 *                 type: string
 *                 description: The description of the post, which can include mentions
 *                 example: "This is a post mentioning @user1 and @user2"
 *               img:
 *                 type: string
 *                 description: An optional image URL for the post
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       201:
 *         description: Successfully created post
 *       400:
 *         description: Invalid request, missing userId or desc
 *       500:
 *         description: Server error
 */
router.post('/post',verifyToken, postController.createpost);

/**
 * @swagger
 * /api/{id}/updatepost:
 *   post:
 *     tags: [Post]
 *     summary: Update a post
 *     description: Updates a post by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - desc
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user updating the post
 *                 example: "60d0fe4f5311236168a109ca"
 *               desc:
 *                 type: string
 *                 description: The updated description of the post
 *                 example: "Updated post description with mentions of @user1 and @user2"
 *     responses:
 *       200:
 *         description: Successfully updated post
 *       400:
 *         description: Invalid request, missing userId or desc
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.post('/:id/updatepost', verifyToken,postController.updatepost);

/**
 * @swagger
 *  /api/{postId}/likes:
 *   put:
 *     tags: [Post]
 *     summary: Like or dislike a post
 *     description: Toggles like or dislike status for a post by ID based on the user ID.
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to like or dislike.
 *       - in: body
 *         name: userId
 *         description: ID of the user liking or disliking the post.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             userId:
 *               type: string
 *               example: '60d5f5c4b4b5a5c7d9c9f5c8'
 *     responses:
 *       200:
 *         description: Successfully toggled like or dislike status for the post.
 *       400:
 *         description: Invalid request, e.g., missing userId or postId.
 *       404:
 *         description: Post not found.
 *       500:
 *         description: Server error.
 */
router.put('/:id/likes',verifyToken, postController.likes);

/**
 * @swagger
 * /api/{id}:
 *   delete:
 *     tags: [Post]
 *     summary: Delete a post
 *     description: Deletes a post by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Successfully deleted post
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.delete('/:id', verifyToken, postController.deletePost);

/**
 * @swagger
 * /api/:
 *   get:
 *     tags: [Post]
 *     summary: Get all posts
 *     description: Retrieves all posts
 *     responses:
 *       200:
 *         description: Successfully fetched all posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Post'
 *       500:
 *         description: Server error
 */
router.get('/', verifyToken,postController.getAllPosts);

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     tags: [Post]
 *     summary: Get posts by user
 *     description: Retrieves posts by a specific user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Successfully fetched posts by user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Post'
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.get('/user/:id', verifyToken,postController.getPostsByUser);

/**
 * @swagger
 * /api/{id}/comments:
 *   put:
 *     tags: [Post]
 *     summary: Add a comment to a post
 *     description: Adds a comment to a post by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - comment
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user adding the comment
 *                 example: "60d0fe4f5311236168a109ca"
 *               comment:
 *                 type: string
 *                 description: The comment text
 *                 example: "This is a great post!"
 *     responses:
 *       200:
 *         description: Successfully added comment
 *       400:
 *         description: Invalid request, missing userId or comment
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.put('/:id/comments', verifyToken,postController.comments);


/**
 * @swagger
 * /api/{id}/addcomments:
 *   put:
 *     tags: [Post]
 *     summary: Add a comment to a post
 *     description: Adds a comment to a post by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user making the comment
 *               text:
 *                 type: string
 *                 description: The comment text
 *     responses:
 *       200:
 *         description: Successfully added comment
 *       400:
 *         description: Invalid request (missing userId or text)
 *       404:
 *         description: Post or User not found
 *       500:
 *         description: Server error
 */
router.put('/:id/addcomments',verifyToken, postController.addComment);


/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags: [User]
 *     summary: Update user information
 *     description: Updates the user information. The user must be either the owner of the profile or an admin.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user performing the update
 *               password:
 *                 type: string
 *                 description: The new password (optional)
 *               isAdmin:
 *                 type: boolean
 *                 description: Admin flag to allow admin users to update other users
 *     responses:
 *       200:
 *         description: Successfully updated user information
 *       400:
 *         description: Invalid request
 *       403:
 *         description: Not authorized to update this user
 *       500:
 *         description: Server error
 */
router.put('/users/:id',verifyToken, userController.update);

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [User]
 *     summary: Get all users
 *     description: Retrieves a list of all users
 *     responses:
 *       200:
 *         description: Successfully fetched all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/User'
 *       500:
 *         description: Server error
 */
router.get('/users',verifyToken, userController.getAlluser);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags: [User]
 *     summary: Get a user by ID
 *     description: Retrieves a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Successfully fetched user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/:id',verifyToken, userController.getUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags: [User]
 *     summary: Delete a user by ID
 *     description: Deletes a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Successfully deleted user
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete('/users/:id',verifyToken, userController.deleteUser);

/**
 * @swagger
 * /api/{id}/follow:
 *   put:
 *     tags: [User]
 *     summary: Follow a user
 *     description: Allows the current user to follow another user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to follow
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the current user making the follow request
 *     responses:
 *       200:
 *         description: User followed successfully
 *       400:
 *         description: Bad request, e.g., trying to follow oneself or already following
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

router.put('/:id/follow', verifyToken,userController.follow);

/**
 * @swagger
 * /api/{id}/unfollow:
 *   put:
 *     tags: [User]
 *     summary: Unfollow a user
 *     description: Removes the current user from the target user's followers list and removes the target user from the current user's following list.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to unfollow.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the current user who is unfollowing.
 *             required:
 *               - userId
 *     responses:
 *       200:
 *         description: User unfollowed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User unfollowed successfully
 *       400:
 *         description: You are not following this user or invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You are not following this user
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while trying to unfollow the user
 */
router.put('/:id/unfollow', verifyToken,userController.unfollow);

module.exports = router;

