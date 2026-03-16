//D:\ASAH\REACT EXPERT\SUBMISSION 1\src\pages\DetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  asyncReceiveThreadDetail, 
  asyncCreateComment, 
  asyncToggleVoteComment 
} from '../states/threadDetailSlice';
import CommentItem from '../components/CommentItem';

export default function DetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const thread = useSelector((state) => state.threadDetail);
  const authUser = useSelector((state) => state.auth?.user);
  const [content, setContent] = useState('');

  useEffect(() => {
    dispatch(asyncReceiveThreadDetail(id));
  }, [id, dispatch]);

  const onCommentSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    dispatch(asyncCreateComment({ threadId: id, content }));
    setContent('');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  if (!thread || thread.id !== id) {
    return <div style={{ textAlign: 'center', marginTop: '50px', color: '#001f3f' }}>Memuat detail...</div>;
  }

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto', padding: '0 20px 50px' }}>
      
      {/* AREA THREAD UTAMA (Hanya Tampilan, Tidak Bisa Vote) */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #eee', marginTop: '20px' }}>
        <header style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          {thread.owner?.avatar && (
            <img
              src={thread.owner.avatar}
              alt={thread.owner.name}
              style={{ width: '42px', height: '42px', borderRadius: '50%', border: '1.5px solid #001f3f', objectFit: 'cover' }}
            />
          )}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ margin: 0, fontSize: '18px', color: '#001f3f', lineHeight: '1.3' }}>{thread.title}</h1>
            <div style={{ fontSize: '12px', color: '#666' }}>
              <span>Oleh <strong>{thread.owner?.name}</strong></span>
              <span style={{ margin: '0 6px' }}>•</span>
              <span>{formatDate(thread.createdAt)}</span>
            </div>
          </div>
        </header>

        <div style={{ marginBottom: '12px' }}>
          <span style={{ backgroundColor: '#f0f2f5', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', color: '#001f3f', fontWeight: 'bold' }}>
            #{thread.category}
          </span>
        </div>

        <div 
          style={{ 
            lineHeight: '1.5', 
            color: '#333', 
            fontSize: '14.5px', 
            borderTop: '1px solid #f9f9f9', 
            paddingTop: '12px',
            marginBottom: '15px'
          }}
          dangerouslySetInnerHTML={{ __html: thread.body }} 
        />

        {/* Info Statis Vote Thread */}
        <div style={{ fontSize: '12px', color: '#888', borderTop: '1px solid #eee', paddingTop: '10px' }}>
          Total Vote Thread: {thread.upVotesBy.length + thread.downVotesBy.length}
        </div>
      </div>

      {/* BOX INPUT KOMENTAR */}
      <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #eee' }}>
        <h4 style={{ marginTop: 0, marginBottom: '8px', color: '#001f3f', fontSize: '14px' }}>Beri Komentar</h4>
        {authUser ? (
          <form onSubmit={onCommentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis balasan kamu..."
              required
              style={textareaStyle}
            />
            <button type="submit" style={submitBtnStyle}>Kirim</button>
          </form>
        ) : (
          <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>Silakan login untuk membalas.</p>
        )}
      </div>

      {/* DAFTAR KOMENTAR (Bisa Di-vote) */}
      <div style={{ marginTop: '20px' }}>
        <h4 style={{ color: '#001f3f', marginBottom: '10px', borderBottom: '1.5px solid #001f3f', display: 'inline-block', fontSize: '14px' }}>
          Komentar ({thread.comments?.length || 0})
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {thread.comments?.length > 0 ? (
            thread.comments.map((comment) => (
              <CommentItem 
                key={comment.id} 
                comment={comment} 
                authUser={authUser}
                onUpvote={() => dispatch(asyncToggleVoteComment({ commentId: comment.id, voteType: 1 }))}
                onDownvote={() => dispatch(asyncToggleVoteComment({ commentId: comment.id, voteType: -1 }))}
              />
            ))
          ) : (
            <p style={{ color: '#999', fontSize: '13px' }}>Belum ada komentar.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Styles ---
const textareaStyle = { 
  width: '100%', minHeight: '60px', padding: '10px', borderRadius: '8px', 
  border: '1px solid #ddd', outline: 'none', fontSize: '13px', fontFamily: 'inherit'
};

const submitBtnStyle = { 
  alignSelf: 'flex-end', padding: '6px 16px', backgroundColor: '#001f3f', 
  color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' 
};