import { asyncFetchThreads } from './threadsSlice';
import api from '../utils/api';

jest.mock('../utils/api');

describe('asyncFetchThreads thunk', () => {

  it('should dispatch correctly when success', async () => {

    api.getThreads.mockResolvedValue({
      data: { threads: [] },
    });

    api.getUsers.mockResolvedValue({
      data: { users: [] },
    });

    const dispatch = jest.fn();

    await asyncFetchThreads()(dispatch);

    expect(dispatch).toHaveBeenCalled();

  });

});