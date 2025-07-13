import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

interface Note {
  id: number;
  title: string;
  content: string;
}

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async () => {
    const { data, error } = await supabase.from('notes').select('*');
    if (error) {
      setError('Error fetching notes: ' + error.message);
      console.error('Error fetching notes:', error);
    } else {
      setError(null);
      setNotes(data as Note[]);
    }
  };

  const addNote = async () => {
    if (!title || !content) {
      setError('Please fill in both title and content');
      return;
    }

    const { data, error } = await supabase.from('notes').insert([{ title, content }]).select();
    if (error) {
      setError('Error saving note: ' + error.message);
      console.error('Error adding note:', error);
    } else if (data) {
      setError(null);
      setNotes([...notes, data[0]]);
      setTitle('');
      setContent('');
    }
  };

  const deleteNote = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (error) {
      setError('Error deleting note: ' + error.message);
      console.error('Error deleting note:', error);
    } else {
      setError(null);
      setNotes(notes.filter(note => note.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">Notes</h1>
      {error && (
        <div className="bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded mb-4 dark:bg-red-900 dark:border-red-600 dark:text-red-200">
          {error}
        </div>
      )}
      <div className="w-full max-w-md">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 dark:bg-gray-800 dark:border-gray-700 rounded mb-2 dark:text-gray-200"
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 dark:bg-gray-800 dark:border-gray-700 rounded mb-2 dark:text-gray-200"
        />
        <button onClick={addNote} className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded dark:bg-blue-700 dark:hover:bg-blue-800">
          Add Note
        </button>
      </div>
      <div className="w-full max-w-md mt-4">
        {notes.map((note) => (
          <div key={note.id} className="w-full dark:bg-gray-800 p-4 rounded shadow mb-2">
            <div className="flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-xl font-bold dark:text-gray-200">{note.title}</h2>
                </div>
                <button 
                  onClick={() => deleteNote(note.id)} 
                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
              <p className="text-gray-300 dark:text-gray-300">{note.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;