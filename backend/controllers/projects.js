const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res, next) => {
  try {
    let query;
    if (req.user.role === 'Admin') {
      query = Project.find({ admin: req.user.id });
    } else {
      query = Project.find({ members: req.user.id });
    }

    const projects = await query.populate('admin', 'name email').populate('members', 'name email');
    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('admin', 'name email')
      .populate('members', 'name email');

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    // Check if user is admin or member
    const isMember = project.members.some((m) => m._id.toString() === req.user.id);
    const isAdmin = project.admin._id.toString() === req.user.id;

    if (!isAdmin && !isMember) {
      return res.status(403).json({ success: false, error: 'Not authorized to view this project' });
    }

    res.status(200).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private (Admin only)
exports.createProject = async (req, res, next) => {
  try {
    req.body.admin = req.user.id;
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin only)
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    if (project.admin.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized to update this project' });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin only)
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    if (project.admin.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this project' });
    }

    await project.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private (Admin only)
exports.addMember = async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ success: false, error: 'Project not found' });
      }

      if (project.admin.toString() !== req.user.id) {
        return res.status(403).json({ success: false, error: 'Not authorized' });
      }

      if (project.members.includes(user._id)) {
        return res.status(400).json({ success: false, error: 'User already a member' });
      }

      project.members.push(user._id);
      await project.save();

      res.status(200).json({ success: true, data: project });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
};
