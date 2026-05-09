const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addMember
} = require('../controllers/projects');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getProjects)
  .post(authorize('Admin'), createProject);

router
  .route('/:id')
  .get(getProject)
  .put(authorize('Admin'), updateProject)
  .delete(authorize('Admin'), deleteProject);

router.post('/:id/members', authorize('Admin'), addMember);

module.exports = router;
