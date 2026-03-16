// D:\ASAH\REACT EXPERT\SUBMISSION 1 - Copy\src\states\threadsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import api from '../utils/api';
import { showLoading, hideLoading } from './loadingSlice';

const threadsSlice = createSlice({
  name: 'threads',
  initialState: {
    data: [],
    filter: '',
  },
  reducers: {
    setThreads(state, action) {
      state.data = action.payload;
    },
    addThread(state, action) {
      state.data.unshift(action.payload);
    },
    setFilter(state, action) {
      state.filter = action.payload;
    },
    /**
     * Mengubah state secara lokal sebelum API selesai (Optimistic Update)
     * voteType: 1 (up), -1 (down), 0 (neutral/unvote)
     */
    toggleVoteThreadOptimistic(state, action) {
      const { threadId, userId, voteType } = action.payload;
      const thread = state.data.find((t) => t.id === threadId);

      if (!thread) return;

      // 1. Bersihkan dulu user ID dari kedua array (antisipasi perubahan vote)
      thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
      thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);

      // 2. Tambahkan ke array yang sesuai berdasarkan voteType
      if (voteType === 1) {
        thread.upVotesBy.push(userId);
      } else if (voteType === -1) {
        thread.downVotesBy.push(userId);
      }
      // Jika voteType === 0, biarkan kosong (sudah bersih di langkah 1)
    },
  },
});

export const {
  setThreads,
  addThread,
  setFilter,
  toggleVoteThreadOptimistic,
} = threadsSlice.actions;

// Action untuk mengambil semua thread
export const asyncFetchThreads = () => async (dispatch) => {
  dispatch(showLoading());
  try {
    const [{ data: threadsData }, { data: usersData }] = await Promise.all([
      api.getThreads(),
      api.getUsers(),
    ]);

    const { threads } = threadsData;
    const { users } = usersData;

    const merged = threads.map((thread) => ({
      ...thread,
      owner: users.find((user) => user.id === thread.ownerId),
    }));

    dispatch(setThreads(merged));
  } catch (error) {
    alert(error.message);
  } finally {
    dispatch(hideLoading());
  }
};

// Action untuk membuat thread baru
export const asyncCreateThread = (payload) => async (dispatch) => {
  dispatch(showLoading());
  try {
    const { data } = await api.createThread(payload);
    dispatch(addThread(data.thread));
  } catch (error) {
    alert(error.message);
  } finally {
    dispatch(hideLoading());
  }
};

/**
 * Action untuk handle vote/unvote
 * payload: { threadId, voteType }
 */
export const asyncToggleVoteThread = ({ threadId, voteType }) => async (dispatch, getState) => {
  const authUser = getState().auth.user;

  if (!authUser) {
    alert('Silakan login terlebih dahulu');
    return;
  }

  const userId = authUser.id;

  // 1. Lakukan update di UI secara instan (Optimistic)
  dispatch(toggleVoteThreadOptimistic({ threadId, userId, voteType }));

  try {
    // 2. Konversi voteType angka ke format string yang dikenali API
    let apiVoteType = 'neutral-vote'; 
    if (voteType === 1) apiVoteType = 'up-vote';
    if (voteType === -1) apiVoteType = 'down-vote';

    // 3. Panggil API
    await api.toggleVoteThread(threadId, apiVoteType);
  } catch (error) {
    alert(error.message);
    // 4. Jika gagal, sinkronkan ulang data dengan server (Rollback)
    dispatch(asyncFetchThreads());
  }
};

export default threadsSlice.reducer;