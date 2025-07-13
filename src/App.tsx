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

  const fetchNotes = async () => {
    const { data, error } = await supabase.from('notes').select('*');
    if (error) console.error('Error fetching notes:', error);
    else setNotes(data as Note[]);
  };

  const addNote = async () => {
    const { data, error } = await supabase.from('notes').insert([{ title, content }]).select();
    if (error) console.error('Error adding note:', error);
    else if (data) {
      setNotes([...notes, data[0]]);
      setTitle('');
      setContent('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">Notes</h1>
      <div className="w-full max-w-md">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <button onClick={addNote} className="w-full bg-blue-500 text-white p-2 rounded">
          Add Note
        </button>
      </div>
      <div className="w-full max-w-md mt-4">
        {notes.map((note) => (
          <div key={note.id} className="bg-white p-4 rounded shadow mb-2">
            <h2 className="text-xl font-bold">{note.title}</h2>
            <p>{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;