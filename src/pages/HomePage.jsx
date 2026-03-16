//D:\ASAH\REACT EXPERT\SUBMISSION 1\src\pages\HomePage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ThreadItem from '../components/ThreadItem';
import { asyncFetchThreads, setFilter, asyncCreateThread } from '../states/threadsSlice'; 

export default function HomePage() {
  const dispatch = useDispatch();
  const { data, filter } = useSelector((state) => state.threads);
  const authUser = useSelector((state) => state.auth?.user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    dispatch(asyncFetchThreads());
  }, [dispatch]);

  const onAddThread = (e) => {
    e.preventDefault();
    dispatch(asyncCreateThread({ title, body, category }));
    setTitle(''); 
    setCategory(''); 
    setBody('');
    setIsModalOpen(false);
  };

  // Mengambil kategori unik untuk filter
  const categories = [...new Set(data.map((t) => t.category))];
  
  // Logika Filter
  const filteredThreads = filter 
    ? data.filter((t) => t.category === filter) 
    : data;

  return (
    <div style={{maxWidth: '800px', margin: '0 auto' }}>
      <header style={{padding: '20px' }}>
        <h2 style={{ color: '#001f3f', marginBottom: '15px' }}>Diskusi Terbaru</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500' }}>Filter Kategori:</label>
          <select 
            value={filter} 
            onChange={(e) => dispatch(setFilter(e.target.value))} 
            style={selectStyle}
          >
            <option value="">Semua</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="threads-list" style={{ padding: '0 20px' }}>
        {filteredThreads.map((thread) => (
          /* Cukup panggil ThreadItem, tombol vote sudah ada di dalamnya */
          <ThreadItem key={thread.id} thread={thread} />
        ))}
      </div>

      {/* Floating Action Button untuk tambah thread */}
      {authUser && (
        <button onClick={() => setIsModalOpen(true)} style={fabStyle}>
          +
        </button>
      )}

      {/* Modal Tambah Thread */}
      {isModalOpen && (
        <div style={modalOverlayStyle} onClick={() => setIsModalOpen(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '20px', color: '#001f3f' }}>Buat Diskusi Baru</h3>
            <form onSubmit={onAddThread} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input 
                placeholder="Judul" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
                style={inputStyle} 
              />
              <input 
                placeholder="Kategori (contoh: react)" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                style={inputStyle} 
              />
              <textarea 
                placeholder="Apa yang ingin kamu sampaikan?" 
                value={body} 
                onChange={(e) => setBody(e.target.value)} 
                required 
                rows="5" 
                style={inputStyle} 
              />
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  style={{ ...submitBtnStyle, backgroundColor: '#fc3e3e' }}
                >
                  Batal
                </button>
                <button type="submit" style={submitBtnStyle}>
                  Posting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- STYLING ---
const selectStyle = { 
  padding: '8px 12px', 
  borderRadius: '8px', 
  border: '1px solid #ddd', 
  outline: 'none',
  cursor: 'pointer'
};

const fabStyle = { 
  position: 'fixed', 
  bottom: '40px', 
  right: '40px', 
  width: '60px', 
  height: '60px', 
  borderRadius: '50%', 
  backgroundColor: '#001f3f', 
  color: 'white', 
  fontSize: '32px', 
  border: 'none', 
  cursor: 'pointer',
  boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
  zIndex: 99,

  // --- JURUS BIAR TENGAH BANGET ---
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 0,             // WAJIB: Hapus padding bawaan button
  lineHeight: 0,          // WAJIB: Hapus ruang antar baris
  paddingBottom: '5px'    // OPSIONAL: "Sentilan" manual ke atas jika tanda + masih kelihatan agak turun
};

const modalOverlayStyle = { 
  position: 'fixed', 
  top: 0, 
  left: 0, 
  right: 0, 
  bottom: 0, 
  backgroundColor: 'rgba(0,0,0,0.6)', 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  zIndex: 1000,
  backdropFilter: 'blur(3px)'
};

const modalContentStyle = { 
  backgroundColor: 'white', 
  padding: '30px', 
  borderRadius: '16px', 
  width: '90%', 
  maxWidth: '500px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
};

const inputStyle = { 
  padding: '12px', 
  borderRadius: '8px', 
  border: '1px solid #ddd',
  fontSize: '14px',
  outline: 'none'
};

const submitBtnStyle = { 
  padding: '10px 20px', 
  backgroundColor: '#001f3f', 
  color: 'white', 
  border: 'none', 
  borderRadius: '8px', 
  cursor: 'pointer',
  fontWeight: 'bold'
};