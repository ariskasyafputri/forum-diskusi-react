import { render, screen } from '@testing-library/react';
import ThreadItem from './ThreadItem';

test('should display thread title', () => {

  const thread = {
    id: 'thread-1',
    title: 'Thread Testing',
    body: 'content',
    owner: { name: 'user', avatar: '' },
    upVotesBy: [],
    downVotesBy: [],
    totalComments: 0,
    createdAt: new Date(),
    category: 'react',
  };

  render(<ThreadItem thread={thread} />);

  expect(screen.getByText('Thread Testing')).toBeInTheDocument();

});