import axiosInstance from '../../../utils/axiosInstance';
import type { PaginatedForumsResponse, PaginatedCommentsResponse, ForumAdminDTO, CommentAdminDTO } from '../types/moderation.types';

interface FetchTopicsParams {
  page: number; // 0-indexed page for the backend
  size: number;
  status: string; // e.g., "ALL", "ACTIVE", "CLOSED", "REPORTED"
}

interface FetchCommentsParams {
  page: number; // 0-indexed page for the backend
  size: number;
  status: string; // e.g., "ALL", "ACTIVE", "HIDDEN", "REPORTED"
}

/**
 * Fetches a paginated and filtered list of forum topics from the real backend.
 */
export const fetchTopics = async ({ page, size, status }: FetchTopicsParams): Promise<PaginatedForumsResponse> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('size', size.toString());
  params.append('sort', 'fechaCreacion,desc'); // Default sort

  if (status && status !== 'ALL') {
    params.append('status', status.toUpperCase());
  }

  const response = await axiosInstance.get<PaginatedForumsResponse>('/api/v1/admin/forum/topics', { params });
  return response.data;
};

/**
 * Updates the status of a forum topic.
 */
export const updateTopicStatus = async (id: number, newStatus: string): Promise<ForumAdminDTO> => {
    const response = await axiosInstance.put<ForumAdminDTO>(`/api/v1/admin/forum/topics/${id}/status`, null, {
        params: { newStatus: newStatus.toUpperCase() }
    });
    return response.data;
};

/**
 * Deletes a forum topic.
 */
export const deleteTopic = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/v1/admin/forum/topics/${id}`);
};

/**
 * Fetches a paginated and filtered list of comments from the real backend.
 */
export const fetchComments = async ({ page, size, status }: FetchCommentsParams): Promise<PaginatedCommentsResponse> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    params.append('sort', 'fechaCreacion,desc'); // Default sort

    if (status && status !== 'ALL') {
        params.append('status', status.toUpperCase());
    }

    const response = await axiosInstance.get<PaginatedCommentsResponse>('/api/v1/admin/forum/comments', { params });
    return response.data;
};

/**
 * Updates the status of a comment.
 */
export const updateCommentStatus = async (id: number, newStatus: string): Promise<CommentAdminDTO> => {
    const response = await axiosInstance.put<CommentAdminDTO>(`/api/v1/admin/forum/comments/${id}/status`, null, {
        params: { newStatus: newStatus.toUpperCase() }
    });
    return response.data;
};

/**
 * Deletes a comment.
 */
export const deleteComment = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/v1/admin/forum/comments/${id}`);
};
