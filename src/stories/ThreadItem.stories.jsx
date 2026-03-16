import ThreadItem from '../components/ThreadItem';

export default {
  title: 'Components/ThreadItem',
  component: ThreadItem,
};

const thread = {
  id: 'thread-1',
  title: 'Belajar React Testing',
  body: '<p>Bagaimana cara membuat unit test di React?</p>',
  category: 'react',
  createdAt: new Date().toISOString(),
  totalComments: 3,
  upVotesBy: ['user-1'],
  downVotesBy: [],
  owner: {
    id: 'user-1',
    name: 'John Doe',
    avatar: 'https://ui-avatars.com/api/?name=John',
  },
};

export const Default = () => <ThreadItem thread={thread} />;

export const NoVotes = () => (
  <ThreadItem
    thread={{
      ...thread,
      upVotesBy: [],
      downVotesBy: [],
    }}
  />
);