import threadsReducer, {
  setThreads,
  addThread,
  setFilter,
  toggleVoteThreadOptimistic,
} from './threadsSlice';

describe('threadsSlice reducer', () => {

  it('should return initial state', () => {
    const state = threadsReducer(undefined, { type: 'unknown' });

    expect(state).toEqual({
      data: [],
      filter: '',
    });
  });

  it('should set threads', () => {
    const threads = [{ id: 'thread-1' }];

    const nextState = threadsReducer(
      { data: [], filter: '' },
      setThreads(threads)
    );

    expect(nextState.data).toEqual(threads);
  });

  it('should add thread', () => {
    const thread = { id: 'thread-1' };

    const nextState = threadsReducer(
      { data: [], filter: '' },
      addThread(thread)
    );

    expect(nextState.data[0]).toEqual(thread);
  });

  it('should set filter', () => {
    const nextState = threadsReducer(
      { data: [], filter: '' },
      setFilter('react')
    );

    expect(nextState.filter).toBe('react');
  });

});