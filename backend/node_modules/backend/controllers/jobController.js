const Job = require('../models/jobModel'); // Ensure this path is correct
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Function to create a new job
exports.createJob = async (req, res) => {
  const { title, description, skills, salary, location } = req.body;
  try {
    const newJob = new Job({
      title,
      description,
      skills,
      salary: parseInt(salary, 10), // Convert salary to an integer
      location,
      user: req.user._id, // Assuming you're getting the user ID from middleware
    });
    await newJob.save();
    res.status(201).json(newJob); // Respond with the created job
  } catch (error) {
    console.error("Job creation error:", error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Function to get all jobs
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({});
    res.status(200).json(jobs); // Respond with the list of jobs
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Function to update a job
exports.updateJob = async (req, res) => {
  const { id } = req.params; // Extract job ID from the route parameters
  const { title, description, skills, salary, location } = req.body;

  try {
    const updatedJob = await Job.findByIdAndUpdate(
      id,
      { title, description, skills, salary: parseInt(salary, 10), location },
      { new: true } // Return the updated job
    );

    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json(updatedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Function to delete a job
exports.deleteJob = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedJob = await Job.findByIdAndDelete(id);

    if (!deletedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};
