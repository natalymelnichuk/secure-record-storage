

const Note = require('../models/Note.js');


// GET /api/notes - Get all notes for the logged-in user
async function getNotes(req, res) {
  // This currently finds all notes in the database.
  // It should only find notes owned by the logged in user.
    try {
        const notes = await Note.find({ user: req.user._id });
        res.json(notes);
    } catch (err) {
        res.status(500).json(err);
    }
};
 
// POST /api/notes - Create a new note
async function createNote(req, res) {
    try {
        const note = await Note.create({
        ...req.body,
        // The user ID needs to be added here
        user: req.user._id
        
        });
        
        res.status(201).json(note);
    } catch (err) {
        res.status(400).json(err);
    }
};
 
// PUT /api/notes/:id - Update a note
async function updateNote (req, res) {
    try {
        // This needs an authorization check
        const note = await Note.findById(req.params.id);
        if (!note) {
        return res.status(404).json({ message: 'No note found with this id!' });
        }

        if (note.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this note!' });
        }

        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true}
        )
        res.json(updatedNote);
    } catch (err) {
        res.status(500).json(err);
    }
};

// DELETE /api/notes/:id - Delete a note
async function deleteNote (req, res) {
    try {
        // This needs an authorization check
        const note = await Note.findById(req.params.id);
        if (!note) {
        return res.status(404).json({ message: 'No note found with this id!' });
        }

        if (note.user.toString() !== req.user._id) {
            return res.status(403).json({ message: 'You are not authorized to delete this note!' });
        }

        await note.deleteOne();

        res.json({ message: 'Note deleted!' });
    } catch (err) {
        res.status(500).json(err);
    }
};

// Optional: Secure “Get Single Note”
async function getNoteById(req, res) {
    try {
        // 1. Find the note with an id
        const note = await Note.findById(req.params.id);

        if (!note) {
        return res.status(404).json({ message: 'No note found with this id!' });
        }

        // 2. Check ownership
        if (note.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You are not authorized to view this note!' });
        }

        // 3. If everything if fine, user'll be able to get this note
        res.json(note);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {
    getNotes,
    createNote,
    updateNote,
    deleteNote,
    getNoteById
}; 

