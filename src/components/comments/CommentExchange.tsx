import { useState, useEffect } from 'react';
import { Star } from 'react-feather';
import { useAuth } from '../../contexts/AuthContext';
import { Comment, getComments, createComment, updateCommentVisibility } from '../../app/services/commentService';
import { toast } from 'react-hot-toast';

interface CommentExchangeProps {
  reservationId: string;
  partnerId: string;
  clientId: string;
  toolId: string;
}

const CommentExchange = ({ reservationId, partnerId, clientId, toolId }: CommentExchangeProps) => {
  const { user } = useAuth();
  const [clientComment, setClientComment] = useState('');
  const [partnerComment, setPartnerComment] = useState('');
  const [clientRating, setClientRating] = useState(0);
  const [partnerRating, setPartnerRating] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [reservationId]);

  const fetchComments = async () => {
    try {
      const fetchedComments = await getComments(reservationId);
      setComments(fetchedComments);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
      setLoading(false);
    }
  };

  const handleSubmitComment = async (isClientComment: boolean) => {
    try {
      const content = isClientComment ? clientComment : partnerComment;
      const rating = isClientComment ? clientRating : partnerRating;

      if (!content.trim()) {
        toast.error('Please enter a comment');
        return;
      }

      if (rating === 0) {
        toast.error('Please provide a rating');
        return;
      }

      await createComment(reservationId, content, rating);

      // Reset form
      if (isClientComment) {
        setClientComment('');
        setClientRating(0);
      } else {
        setPartnerComment('');
        setPartnerRating(0);
      }

      toast.success('Comment submitted successfully');
      fetchComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error('Failed to submit comment');
    }
  };

  const renderStarRating = (rating: number, setRating: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className="focus:outline-none"
          >
            <Star
              size={20}
              className={`${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const renderCommentForm = (isClientComment: boolean) => {
    const isClient = user?.id === clientId;
    const isPartner = user?.id === partnerId;

    // Only show the appropriate form based on user role
    if ((isClientComment && !isClient) || (!isClientComment && !isPartner)) {
      return null;
    }

    // Check if user has already submitted a comment
    const hasSubmitted = comments.some(
      (comment) => comment.userId === user?.id && comment.isVisible
    );

    if (hasSubmitted) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            You have already submitted a comment for this reservation.
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-6">
        <h3 className="text-lg font-semibold mb-4">
          {isClientComment ? 'Leave a Comment for the Partner' : 'Leave a Comment for the Client'}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rating
            </label>
            {renderStarRating(
              isClientComment ? clientRating : partnerRating,
              isClientComment ? setClientRating : setPartnerRating
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Comment
            </label>
            <textarea
              value={isClientComment ? clientComment : partnerComment}
              onChange={(e) =>
                isClientComment
                  ? setClientComment(e.target.value)
                  : setPartnerComment(e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              rows={4}
              placeholder="Share your experience..."
            />
          </div>
          <button
            onClick={() => handleSubmitComment(isClientComment)}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Submit Comment
          </button>
        </div>
      </div>
    );
  };

  const renderComments = () => {
    if (loading) {
      return <div className="text-center py-4">Loading comments...</div>;
    }

    const visibleComments = comments.filter((comment) => {
      // Show comment if both parties have commented
      const hasClientComment = comments.some(
        (c) => c.userId === clientId && c.isVisible
      );
      const hasPartnerComment = comments.some(
        (c) => c.userId === partnerId && c.isVisible
      );

      // Show comment if it's been a week since creation
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const isOlderThanWeek = new Date(comment.createdAt) < oneWeekAgo;

      return comment.isVisible && (hasClientComment && hasPartnerComment || isOlderThanWeek);
    });

    if (visibleComments.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          No comments yet
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {visibleComments.map((comment) => (
          <div
            key={comment.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {comment.userName}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center">
                {renderStarRating(comment.rating, () => {})}
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderCommentForm(true)}
      {renderCommentForm(false)}
      {renderComments()}
    </div>
  );
};

export default CommentExchange; 