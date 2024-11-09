import { useQuery } from '@tanstack/react-query';
import ReviewItem, { ReviewItemProps } from './ReviewItem';
import axios from 'axios';
import { useState } from 'react';

const ReviewList = () => {
  const [reviewList, setReviewList] = useState<ReviewItemProps['review'][]>([]);

  useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_API_URL}/reviews`,
      );
      setReviewList(res.data);
      console.log(res.data);
      return res.data;
    },
  });

  return (
    <div>
      <ul className="flex flex-col">
        {reviewList.map((review) => (
          <ReviewItem review={review} />
        ))}
      </ul>
    </div>
  );
};

export default ReviewList;
