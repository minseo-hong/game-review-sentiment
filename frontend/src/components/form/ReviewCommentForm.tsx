import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import {
  FaRegThumbsDown,
  FaRegThumbsUp,
  FaThumbsDown,
  FaThumbsUp,
} from 'react-icons/fa';

import axios from '../../api/axios';

const ReviewCommentForm = () => {
  const queryClient = useQueryClient();

  const [reviewValue, setReviewValue] = useState<{
    text: string;
    isPositive: boolean | null;
  }>({
    text: '',
    isPositive: null,
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const predictReviewSentiment = useMutation({
    mutationFn: async () => {
      const res = await axios.post('/reviews/ai/is-positive', {
        text: reviewValue.text,
      });
      return res.data;
    },
    onSuccess: async (data) => {
      setReviewValue({
        ...reviewValue,
        isPositive: data.isPositive,
      });
      await queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });

  const addReview = useMutation({
    mutationFn: async () => {
      const res = await axios.post('/reviews', {
        text: reviewValue.text,
        isPositive: reviewValue.isPositive,
      });
      return res.data;
    },
    onSuccess: async () => {
      setReviewValue({
        text: '',
        isPositive: null,
      });
      await queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });

  const handleSentimentButtonClick = () => {
    if (reviewValue.isPositive === null) {
      predictReviewSentiment.mutate();
    } else {
      setReviewValue({
        ...reviewValue,
        isPositive: !reviewValue.isPositive,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReviewValue({
      ...reviewValue,
      text: e.target.value,
    });
  };

  const handleSubmitButtonClick = () => {
    addReview.mutate();
  };

  useEffect(() => {
    setReviewValue({
      ...reviewValue,
      isPositive: null,
    });
  }, [reviewValue.text]);

  useEffect(() => {
    setButtonDisabled(
      reviewValue.text.length === 0 || reviewValue.isPositive === null,
    );
  }, [reviewValue]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div
            className={clsx(
              'flex h-[4rem] w-[4rem] cursor-pointer items-center justify-center gap-1 rounded-full border-2 duration-150',
              {
                'border-green-500 bg-green-100 text-[1.5rem] text-green-500 hover:border-green-600':
                  reviewValue.isPositive === true,
                'border-red-500 bg-red-100 text-[1.5rem] text-red-500 hover:border-red-600':
                  reviewValue.isPositive === false,
                'border-neutral-300 bg-neutral-200 text-[1.25rem] text-neutral-500 hover:border-neutral-400':
                  reviewValue.isPositive === null,
              },
            )}
            onClick={handleSentimentButtonClick}
          >
            {reviewValue.isPositive === null ? (
              <>
                <FaRegThumbsUp />
                <FaRegThumbsDown />
              </>
            ) : reviewValue.isPositive === true ? (
              <FaThumbsUp />
            ) : (
              reviewValue.isPositive === false && <FaThumbsDown />
            )}
          </div>
          <textarea
            className="flex-1 resize-none rounded-md border border-neutral-400 px-2 py-1 outline-none duration-150 focus:ring-1 focus:ring-neutral-600"
            value={reviewValue.text}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          className="rounded-md bg-neutral-800 px-4 py-2 text-white duration-150 disabled:bg-neutral-300"
          disabled={buttonDisabled}
          onClick={handleSubmitButtonClick}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ReviewCommentForm;
