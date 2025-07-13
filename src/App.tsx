import { useState, useEffect, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { supabase } from './supabaseClient';
import Note from './Note';
import EditNoteModal from './EditNoteModal';

interface NoteData {
  id: number;
  title: string;
  content: string;
  position: number;
}

function App() {
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching notes:', error);
    } else if (data) {
      const notesWithPositions = data.map((note, index) => ({
        ...note,
        position: note.position ?? index,
      }));
      setNotes(notesWithPositions);

      const updates = notesWithPositions
        .map((note, idx) => 
          supabase.from('notes').update({ position: idx }).eq('id', note.id)
        );

      await Promise.all(updates);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const addNote = async () => {
    if (!title && !content) return;
    const newPosition = notes.length > 0 ? Math.max(...notes.map(n => n.position)) + 1 : 0;
    const { data, error } = await supabase
      .from('notes')
      .insert([{ title, content, position: newPosition }])
      .select();

    if (error) {
      console.error('Error adding note:', error);
    } else if (data) {
      setNotes([...notes, data[0]]);
      setTitle('');
      setContent('');
      setIsCreating(false);
    }
  };

  const deleteNote = async (id: number) => {
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (error) {
      console.error('Error deleting note:', error);
    } else {
      setNotes(notes.filter(note => note.id !== id));
    }
  };

  const updateNote = async (id: number, title: string, content: string) => {
    const { data, error } = await supabase
      .from('notes')
      .update({ title, content })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating note:', error);
    } else if (data) {
      setNotes(notes.map(note => (note.id === id ? data[0] : note)));
    }
  };

  const moveNote = useCallback((dragIndex: number, hoverIndex: number) => {
    setNotes((prevNotes) => {
      const newNotes = [...prevNotes];
      const [movedNote] = newNotes.splice(dragIndex, 1);
      newNotes.splice(hoverIndex, 0, movedNote);
      return newNotes;
    });
  }, []);

  const saveNoteOrder = async () => {
    const updates = notes.map((note, index) =>
      supabase.from('notes').update({ position: index }).eq('id', note.id)
    );
    await Promise.all(updates);
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-100 p-2 sm:p-4">
        <div className="max-w-6xl mx-auto px-2 sm:px-4">
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 mb-4 bg-white rounded-lg shadow-md focus:outline-none"
            />
            {isCreating ? (
              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md">
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border-b focus:outline-none"
                />
                <textarea
                  placeholder="Take a note..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-2 h-24 focus:outline-none"
                />
                <div className="flex justify-end">
                  <button onClick={addNote} className="bg-yellow-500 text-white px-4 py-2 rounded-md">
                    Add Note
                  </button>
                </div>
              </div>
            ) : (
              <div 
                className="bg-white p-4 rounded-lg shadow-md cursor-text"
                onClick={() => setIsCreating(true)}
              >
                <p className="text-gray-500">Take a note...</p>
              </div>
            )}
          </div>
          <div className="w-full px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
              {filteredNotes.map((note, index) => (
                <div key={note.id} className="w-60">
                  <Note 
                    note={note} 
                    index={index}
                    onDelete={deleteNote}
                    onEdit={setEditingNote}
                    moveNote={moveNote}
                    onDropEnd={saveNoteOrder}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        {editingNote && (
          <EditNoteModal 
            note={editingNote} 
            onClose={() => setEditingNote(null)} 
            onSave={updateNote} 
          />
        )}
      </div>
    </DndProvider>
  );
}

export default App;
