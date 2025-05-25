import { API_URL } from '../config';

export interface Comment {
  id: string;
  reservationId: string;
  userId: string;
  userName: string;
  content: string;
  rating: number;
  createdAt: string;
  isVisible: boolean;
}

export const getComments = async (reservationId: string): Promise<Comment[]> => {
  try {
    const response = await fetch(`${API_URL}/reservations/${reservationId}/comments`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const createComment = async (
  reservationId: string,
  content: string,
  rating: number
): Promise<Comment> => {
  try {
    const response = await fetch(`${API_URL}/reservations/${reservationId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        content,
        rating,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create comment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

export const updateCommentVisibility = async (
  commentId: string,
  isVisible: boolean
): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/comments/${commentId}/visibility`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        isVisible,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update comment visibility');
    }
  } catch (error) {
    console.error('Error updating comment visibility:', error);
    throw error;
  }
}; 