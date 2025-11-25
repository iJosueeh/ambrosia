import axiosInstance from '../../../utils/axiosInstance';
import type { ResourceAdminDTO, ResourceUpdateDTO, ResourceCategory, ResourceStatus, PaginatedAdminResources } from '../types/resource.types';

interface FetchResourcesParams {
  page: number;
  size: number;
  categoryId?: number | null;
  statusId?: number | null;
  search: string;
}

export const fetchAdminResources = async ({ page, size, categoryId, statusId, search }: FetchResourcesParams): Promise<PaginatedAdminResources> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('size', size.toString());
  params.append('sort', 'id,asc');

  if (search) {
    params.append('search', search);
  }
  if (categoryId) {
    params.append('categoryId', categoryId.toString());
  }
  if (statusId) {
    params.append('statusId', statusId.toString());
  }

  const response = await axiosInstance.get<PaginatedAdminResources>('/admin/resources', { params });
  return response.data;
};

export const fetchResourceCategories = async (): Promise<ResourceCategory[]> => {
    const response = await axiosInstance.get<ResourceCategory[]>('/resource-categories');
    return response.data;
};

export const fetchResourceStatuses = async (): Promise<ResourceStatus[]> => {
    const response = await axiosInstance.get<ResourceStatus[]>('/resource-statuses');
    return response.data;
};

export const createResource = async (resource: ResourceUpdateDTO): Promise<ResourceAdminDTO> => {
    const response = await axiosInstance.post<ResourceAdminDTO>('/admin/resources', resource);
    return response.data;
};

export const updateResource = async (id: number, resource: ResourceUpdateDTO): Promise<ResourceAdminDTO> => {
    const response = await axiosInstance.put<ResourceAdminDTO>(`/admin/resources/${id}`, resource);
    return response.data;
};

export const deleteResource = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/resources/${id}`);
};
