import { render, screen } from '@testing-library/react';
import CommentItem from './CommentItem';

test('should render comment', () => {

  const comment = {
    id: 'comment-1',
    content: 'Test comment',
    owner: { name: 'user', avatar: '' },
    upVotesBy: [],
    downVotesBy: [],
  };

  render(
    <CommentItem
      comment={comment}
      authUser={{ id: 'user-1' }}
      onUpvote={() => {}}
      onDownvote={() => {}}
    />
  );

  expect(screen.getByText('user')).toBeInTheDocument();

});