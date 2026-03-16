// D:\ASAH\REACT EXPERT\forum-app - Copy\src\components\CommentItem.jsx
import React from 'react';

export default function CommentItem({ comment, authUser, onUpvote, onDownvote }) {
  const isUpvoted = comment.upVotesBy?.includes(authUser?.id);
  const isDownvoted = comment.downVotesBy?.includes(authUser?.id);

  return (
    <div style={{ padding: '15px', borderBottom: '1px solid #f0f0f0' }}>
      <header style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
        <img src={comment.owner.avatar} alt={comment.owner.name} style={{ width: '24px', borderRadius: '50%' }} />
        <strong style={{ fontSize: '13px' }}>{comment.owner.name}</strong>
      </header>
      <div style={{ fontSize: '14px', marginBottom: '10px' }} dangerouslySetInnerHTML={{ __html: comment.content }} />
      
      <div style={{ display: 'flex', gap: '15px' }}>
        <button onClick={onUpvote} style={{ ...btnStyle, color: isUpvoted ? 'red' : '#888' }}>
          👍 {comment.upVotesBy.length}
        </button>
        <button onClick={onDownvote} style={{ ...btnStyle, color: isDownvoted ? 'red' : '#888' }}>
          👎 {comment.downVotesBy.length}
        </button>
      </div>
    </div>
  );
}

const btnStyle = { background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' };