// D:\ASAH\REACT EXPERT\SUBMISSION 1 - Copy\src\components\ThreadItem.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { asyncToggleVoteThread } from '../states/threadsSlice';

export default function ThreadItem({ thread }) {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth?.user);
  const [isTitleHovered, setIsTitleHovered] = useState(false);

  // Status vote user saat ini
  const isUpVoted = authUser ? thread.upVotesBy.includes(authUser.id) : false;
  const isDownVoted = authUser ? thread.downVotesBy.includes(authUser.id) : false;

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  const onVoteClick = (voteType) => {
    if (!authUser) {
      alert('Login dulu boss, baru bisa vote');
      return;
    }

    let finalType = voteType;
    // Logika Unvote: Jika klik tombol yang sama dengan status sekarang, kirim 0
    if ((voteType === 1 && isUpVoted) || (voteType === -1 && isDownVoted)) {
      finalType = 0;
    }

    // Pastikan mengirim voteType (angka) sesuai dengan threadsSlice yang baru
    dispatch(asyncToggleVoteThread({ threadId: thread.id, voteType: finalType }));
  };

  const cleanBody = stripHtml(thread.body);

  return (
    <div style={cardStyle}>
      <Link
        to={`/threads/${thread.id}`}
        style={{
          textDecoration: isTitleHovered ? 'underline' : 'none',
          color: '#001f3f',
        }}
        onMouseEnter={() => setIsTitleHovered(true)}
        onMouseLeave={() => setIsTitleHovered(false)}
      >
        <h3 style={titleStyle}>{thread.title}</h3>
      </Link>

      <p style={bodyStyle}>
        {cleanBody.length > 150 ? `${cleanBody.slice(0, 150)}...` : cleanBody}
      </p>

      <div style={metaStyle}>
        <img
          src={thread.owner?.avatar}
          alt={thread.owner?.name}
          style={avatarStyle}
        />
        <span style={{ fontWeight: '500' }}>{thread.owner?.name}</span>
        <span>•</span>
        <span>{new Date(thread.createdAt).toLocaleDateString('id-ID')}</span>
        <span>•</span>
        <span style={categoryBadgeStyle}>#{thread.category}</span>
      </div>

      <div style={footerStyle}>
        {/* TOMBOL UPVOTE */}
        <button
          type="button"
          onClick={() => onVoteClick(1)}
          style={{
            ...voteButtonStyle,
            backgroundColor: isUpVoted ? '#2ea44f' : 'white',
            color: isUpVoted ? 'white' : '#555',
            borderColor: isUpVoted ? '#2ea44f' : '#ddd',
          }}
        >
          👍 {thread.upVotesBy.length}
        </button>

        {/* TOMBOL DOWNVOTE */}
        <button
          type="button"
          onClick={() => onVoteClick(-1)}
          style={{
            ...voteButtonStyle,
            backgroundColor: isDownVoted ? '#cf222e' : 'white',
            color: isDownVoted ? 'white' : '#555',
            borderColor: isDownVoted ? '#cf222e' : '#ddd',
          }}
        >
          👎 {thread.downVotesBy.length}
        </button>

        <span style={commentInfoStyle}>
          💬 {thread.totalComments} <span style={{ color: '#888' }}>Komentar</span>
        </span>
      </div>
    </div>
  );
}

// --- STYLING (Tetap Sama) ---
const cardStyle = {
  border: '1px solid #eee',
  padding: '20px',
  marginBottom: '15px',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  backgroundColor: 'white',
};

const titleStyle = { margin: '0 0 10px 0', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' };
const bodyStyle = { color: '#444', fontSize: '14px', lineHeight: '1.6', marginBottom: '15px', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' };
const metaStyle = { fontSize: '12px', color: '#888', marginBottom: '15px', display: 'flex', gap: '8px', alignItems: 'center' };
const avatarStyle = { width: '24px', height: '24px', borderRadius: '50%', border: '1px solid #ddd', objectFit: 'cover' };
const categoryBadgeStyle = { backgroundColor: '#f0f2f5', padding: '2px 10px', borderRadius: '12px', color: '#001f3f', fontWeight: '600' };
const footerStyle = { display: 'flex', alignItems: 'center', gap: '15px', borderTop: '1px solid #f0f2f5', paddingTop: '15px' };
const voteButtonStyle = { cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '20px', border: '1px solid', fontSize: '13px', transition: 'all 0.2s ease', fontWeight: '600' };
const commentInfoStyle = { fontSize: '13px', color: '#555', display: 'flex', alignItems: 'center', gap: '5px' };