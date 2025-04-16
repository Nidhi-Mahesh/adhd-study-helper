const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const Todo = require('../models/Todo');

// Get notes
router.get('/notes', async (req, res) => {
  const notes = await Note.find().sort({ createdAt: -1 }).limit(1);
  res.json(notes[0] || {});
});

// Save/update notes
router.post('/notes', async (req, res) => {
  const { sticky, distraction, voiceNoteUrl } = req.body;
  let note = await Note.findOne();
  if (!note) note = new Note();
  note.sticky = sticky;
  note.distraction = distraction;
  note.voiceNoteUrl = voiceNoteUrl;
  await note.save();
  res.json({ message: 'Saved', note });
});

// Todos
router.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

router.post('/todos', async (req, res) => {
  const { text } = req.body;
  const todo = new Todo({ text });
  await todo.save();
  res.json(todo);
});

router.delete('/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
