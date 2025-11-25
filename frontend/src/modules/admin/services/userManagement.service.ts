import axiosInstance from '../../../utils/axiosInstance';
import type { AdminUser, PaginatedUsersResponse } from '../types/user.types';

interface FetchUsersParams {
  page: number; // 0-indexed page for the backend
  size: number;
  role: string;
  search: string;
}

/**
 * Fetches a paginated and filtered list of users from the real backend.
 */
export const fetchUsers = async ({ page, size, role, search }: FetchUsersParams): Promise<PaginatedUsersResponse> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('size', size.toString());
  params.append('sort', 'id,asc'); // Add default sorting

  if (search) {
    params.append('search', search);
  }
  
  if (role && role !== 'Todos') {
    params.append('role', role);
  }

  const response = await axiosInstance.get<PaginatedUsersResponse>('/admin/users', { params });
  return response.data;
};

/**
 * Updates a user's details.
 */
export const updateUser = async (user: AdminUser): Promise<AdminUser> => {
    const response = await axiosInstance.put<AdminUser>(`/admin/users/${user.id}`, user);
    return response.data;
}

/**
 * Deletes a user by their ID.
 */
export const deleteUser = async (userId: number): Promise<void> => {
    await axiosInstance.delete(`/admin/users/${userId}`);
}
