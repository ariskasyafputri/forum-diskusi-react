import threadsReducer, { toggleVoteThreadOptimistic } from './threadsSlice';

describe('toggleVoteThreadOptimistic', () => {

  it('should upvote thread', () => {

    const initialState = {
      data: [
        {
          id: 'thread-1',
          upVotesBy: [],
          downVotesBy: [],
        },
      ],
      filter: '',
    };

    const action = toggleVoteThreadOptimistic({
      threadId: 'thread-1',
      userId: 'user-1',
      voteType: 1,
    });

    const nextState = threadsReducer(initialState, action);

    expect(nextState.data[0].upVotesBy).toContain('user-1');
  });

});