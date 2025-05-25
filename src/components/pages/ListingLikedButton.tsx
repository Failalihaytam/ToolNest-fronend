// Example: ListingLikeButton.tsx
import { useEffect, useState } from 'react';
import { likeListing, unlikeListing, isListingLiked } from '../../app/services/listingService';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

interface Props {
  listingId: number;
}

const ListingLikeButton = ({ listingId }: Props) => {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    isListingLiked(listingId)
      .then(res => setLiked(res.data.liked))
      .finally(() => setLoading(false));
  }, [listingId]);

  const handleToggle = async () => {
    setLoading(true);
    if (liked) {
      await unlikeListing(listingId);
      setLiked(false);
    } else {
      await likeListing(listingId);
      setLiked(true);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      aria-label={liked ? 'Unlike' : 'Like'}
      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
    >
      {liked ? (
        <AiFillHeart color="red" size={28} />
      ) : (
        <AiOutlineHeart color="gray" size={28} />
      )}
    </button>
  );
};

export default ListingLikeButton;