const express = require('express');
const { createJob, getJobs, updateJob, deleteJob } = require('../controllers/jobController'); 
const { protect } = require('../middleware/authMiddleware'); // Imported middleware to protect routes
const router = express.Router(); // Create a new router


router.post('/', protect, createJob); 

// GET request to fetch all jobs (public route)
router.get('/', getJobs); // Ensure getJobs is defined

// PUT request to update a specific job by its ID (protected route)
router.put('/:id', protect, updateJob); 

// DELETE request to delete a specific job by its ID (protected route)
router.delete('/:id', protect, deleteJob); 

module.exports = router;
