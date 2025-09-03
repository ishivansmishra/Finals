import axios from "axios";

// Use Vite's environment variables
const API_BASE = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// ETag helper
export const getWithETag = async (url: string, etag?: string) => {
  const res = await api.get(url, { headers: etag ? { "If-None-Match": etag } : {} });
  return { data: res.data, etag: res.headers.etag };
};

export const fetchAnnouncements = async (etag?: string) =>
  getWithETag("/announcements", etag);

export const fetchComments = async (announcementId: string, cursor?: string, limit = 5) =>
  api.get(`/announcements/${announcementId}/comments`, { params: { cursor, limit } }).then(res => res.data);

export const postComment = async (announcementId: string, comment: { authorName: string; text: string }) =>
  api.post(`/announcements/${announcementId}/comments`, comment);

export const postReaction = async (announcementId: string, type: 'up' | 'down' | 'heart', userId: string) =>
  api.post(`/announcements/${announcementId}/reactions`, { type }, { headers: { "x-user-id": userId } });

export const deleteReaction = async (announcementId: string, userId: string) =>
  api.delete(`/announcements/${announcementId}/reactions`, { headers: { "x-user-id": userId } });
