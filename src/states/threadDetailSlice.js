// D:\ASAH\REACT EXPERT\forum-app - Copy\src\states\threadDetailSlice.js
import { createSlice } from '@reduxjs/toolkit';
import api from '../utils/api';
import { showLoading, hideLoading } from './loadingSlice';

const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState: null,
  reducers: {
    setThreadDetail: (state, action) => action.payload,
    clearThreadDetail: () => null,
  },
});

export const { setThreadDetail, clearThreadDetail } = threadDetailSlice.actions;

export const asyncReceiveThreadDetail = (threadId) => async (dispatch) => {
  dispatch(showLoading());
  try {
    const response = await api.getThreadDetail(threadId);
    dispatch(setThreadDetail(response.data.detailThread));
  } catch (error) {
    alert(error.message);
  } finally {
    dispatch(hideLoading());
  }
};

export const asyncCreateComment = ({ threadId, content }) => async (dispatch) => {
  dispatch(showLoading());
  try {
    await api.createComment({ threadId, content });
    const response = await api.getThreadDetail(threadId);
    dispatch(setThreadDetail(response.data.detailThread));
  } catch (error) {
    alert(error.message);
  } finally {
    dispatch(hideLoading());
  }
};

// VOTE KOMENTAR SAJA (Logic Unvote Otomatis)
export const asyncToggleVoteComment = ({ commentId, voteType }) => async (dispatch, getState) => {
  const { threadDetail, auth } = getState();
  if (!auth.user) return alert('Login dulu bos!');

  try {
    const comment = threadDetail.comments.find((c) => c.id === commentId);
    const isUpvoted = comment.upVotesBy.includes(auth.user.id);
    const isDownvoted = comment.downVotesBy.includes(auth.user.id);

    let finalType = voteType;
    // Jika klik tombol yang sama, maka jadi netral (unvote)
    if ((voteType === 1 && isUpvoted) || (voteType === -1 && isDownvoted)) {
      finalType = 0;
    }

    await api.toggleVoteComment(threadDetail.id, commentId, finalType);
    const response = await api.getThreadDetail(threadDetail.id);
    dispatch(setThreadDetail(response.data.detailThread));
  } catch (error) {
    alert(error.message);
  }
};

export default threadDetailSlice.reducer;