import { useState, useEffect, useRef, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { supabase } from './supabaseClient';
import Note from './Note';
import EditNoteModal from './EditNoteModal';
import Masonry from 'masonry-layout';

interface Note {
  id: number;
  title: string;
  content: string;
}

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    if (gridRef.current) {
      new Masonry(gridRef.current, {
        itemSelector: '.grid-item',
        columnWidth: 240,
        gutter: 16,
      });
    }
  }, [notes]);

  const fetchNotes = async () => {
    const { data, error } = await supabase.from('notes').select('*');
    if (error) console.error('Error fetching notes:', error);
    else setNotes(data as Note[]);
  };

  const addNote = async () => {
    if (!title && !content) return;
    const { data, error } = await supabase.from('notes').insert([{ title, content }]).select();
    if (error) console.error('Error adding note:', error);
    else if (data) {
      setNotes([...notes, data[0]]);
      setTitle('');
      setContent('');
      setIsCreating(false);
    }
  };

  const deleteNote = async (id: number) => {
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (error) console.error('Error deleting note:', error);
    else setNotes(notes.filter(note => note.id !== id));
  };

  const updateNote = async (id: number, title: string, content: string) => {
    const { data, error } = await supabase.from('notes').update({ title, content }).eq('id', id).select();
    if (error) console.error('Error updating note:', error);
    else if (data) {
      setNotes(notes.map(note => note.id === id ? data[0] : note));
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



  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          {isCreating ? (
            <div className="bg-white p-4 rounded-lg shadow-md">
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
        <div ref={gridRef} className="w-full">
          {notes.map((note, index) => (
            <div key={note.id} className="grid-item w-60 mb-4">
              <Note 
                note={note} 
                index={index}
                onDelete={deleteNote} 
                onEdit={setEditingNote}
                moveNote={moveNote}
              />
            </div>
          ))}
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