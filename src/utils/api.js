// D:\ASAH\REACT EXPERT\forum-app - Copy\src\utils\api.js
const BASE_URL = 'https://forum-api.dicoding.dev/v1';

const api = (() => {
  function putAccessToken(token) { localStorage.setItem('accessToken', token); }
  function getAccessToken() { return localStorage.getItem('accessToken'); }

  async function _fetchWithToken(url, options = {}) {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
  }

  return {
    putAccessToken,
    getAccessToken,
    login: (payload) => fetch(`${BASE_URL}/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then((r) => r.json()),
    register: (payload) => fetch(`${BASE_URL}/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then((r) => r.json()),
    getOwnProfile: () => _fetchWithToken(`${BASE_URL}/users/me`).then((r) => r.json()),
    getThreads: () => fetch(`${BASE_URL}/threads`).then((r) => r.json()),
    getUsers: () => fetch(`${BASE_URL}/users`).then((r) => r.json()),
    getThreadDetail: (id) => fetch(`${BASE_URL}/threads/${id}`).then((r) => r.json()),
    createThread: (data) => _fetchWithToken(`${BASE_URL}/threads`, { method: 'POST', body: JSON.stringify(data) }).then((r) => r.json()),
    createComment: ({ threadId, content }) => _fetchWithToken(`${BASE_URL}/threads/${threadId}/comments`, { method: 'POST', body: JSON.stringify({ content }) }).then((r) => r.json()),
    
    // VOTE THREAD
    toggleVoteThread: (threadId, type) => {
      let action = 'neutral-vote';
      if (type === 1) action = 'up-vote';
      if (type === -1) action = 'down-vote';
      return _fetchWithToken(`${BASE_URL}/threads/${threadId}/${action}`, { method: 'POST' }).then((r) => r.json());
    },

    // VOTE KOMENTAR
    toggleVoteComment: (threadId, commentId, type) => {
      let action = 'neutral-vote';
      if (type === 1) action = 'up-vote';
      if (type === -1) action = 'down-vote';
      return _fetchWithToken(`${BASE_URL}/threads/${threadId}/comments/${commentId}/${action}`, { method: 'POST' }).then((r) => r.json());
    },

    getLeaderboard: () => fetch(`${BASE_URL}/leaderboards`).then((r) => r.json()),
  };
})();

export default api;