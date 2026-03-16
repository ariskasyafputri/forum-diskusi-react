import VoteButton from '../components/VoteButton';

export default {
  title: 'Components/VoteButton',
  component: VoteButton,
};

const authUser = {
  id: 'user-1',
};

export const ThreadVote = () => (
  <VoteButton
    id="thread-1"
    upVotes={['user-1', 'user-2']}
    downVotes={[]}
    authUser={authUser}
    type="thread"
  />
);

export const CommentVote = () => (
  <VoteButton
    id="comment-1"
    threadId="thread-1"
    upVotes={[]}
    downVotes={['user-2']}
    authUser={authUser}
    type="comment"
  />
  
);