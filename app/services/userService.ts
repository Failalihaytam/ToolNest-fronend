import api from './api';

// Instead, import:
import { User } from '../../src/types/User';
import { Tool } from '../../src/types/Tool';

export async function getUserProfile(id: string | number): Promise<User> {
  const res = await api.get(`/users/${id}`);
  return res.data;
}