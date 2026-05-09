const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get all tasks
// @route   GET /api/tasks
// @route   GET /api/projects/:projectId/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
  try {
    let query;

    if (req.params.projectId) {
      query = Task.find({ project: req.params.projectId });
    } else {
      if (req.user.role === 'Admin') {
        // Admins see tasks of projects they manage
        const projects = await Project.find({ admin: req.user.id });
        const projectIds = projects.map(p => p._id);
        query = Task.find({ project: { $in: projectIds } });
      } else {
        // Members see tasks assigned to them
        query = Task.find({ assignedTo: req.user.id });
      }
    }

    const tasks = await query.populate('project', 'title').populate('assignedTo', 'name email');
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('project', 'title admin members');

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    res.status(200).json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Create task
// @route   POST /api/projects/:projectId/tasks
// @access  Private (Admin only)
exports.createTask = async (req, res, next) => {
  try {
    req.body.project = req.params.projectId;
    req.body.createdBy = req.user.id;

    const project = await Project.findById(req.params.projectId);
    if (!project) {
        return res.status(404).json({ success: false, error: 'Project not found' });
    }

    if (project.admin.toString() !== req.user.id) {
        return res.status(403).json({ success: false, error: 'Not authorized to create tasks for this project' });
    }

    const task = await Task.create(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    // Admins can update everything, Members can only update status
    if (req.user.role !== 'Admin' && task.assignedTo.toString() !== req.user.id) {
        return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    if (req.user.role !== 'Admin') {
        // Members can only update status
        const { status } = req.body;
        task = await Task.findByIdAndUpdate(req.params.id, { status }, {
            new: true,
            runValidators: true,
        });
    } else {
        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
    }

    res.status(200).json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (Admin only)
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    if (req.user.role !== 'Admin') {
        return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    await task.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
