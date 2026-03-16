import { asyncLogin } from './authSlice';
import api from '../utils/api';

jest.mock('../utils/api');

describe('asyncLogin thunk', () => {

  it('should login successfully', async () => {

    api.login.mockResolvedValue({
      data: { token: 'token' },
    });

    api.getOwnProfile.mockResolvedValue({
      data: { user: { id: 'user-1', name: 'user' } },
    });

    const dispatch = jest.fn();

    await asyncLogin({
      email: 'test@mail.com',
      password: 'password',
    })(dispatch);

    expect(dispatch).toHaveBeenCalled();

  });

});