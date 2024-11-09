import clsx from 'clsx';
import dayjs from 'dayjs';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';

export interface ReviewItemProps {
  review: {
    id: number;
    text: string;
    isPositive: boolean;
    updatedAt: string;
  };
}

const ReviewItem = ({ review }: ReviewItemProps) => {
  return (
    <li className="border-t border-neutral-300 py-4 last:border-b">
      <div className="flex gap-4">
        <div
          className={clsx(
            'flex h-[4rem] w-[4rem] items-center justify-center gap-1 rounded-full border-2 duration-150',
            {
              'border-green-500 bg-green-100 text-[1.5rem] text-green-500':
                review.isPositive === true,
              'border-red-500 bg-red-100 text-[1.5rem] text-red-500':
                review.isPositive === false,
            },
          )}
        >
          {review.isPositive === true ? (
            <FaThumbsUp />
          ) : (
            review.isPositive === false && <FaThumbsDown />
          )}
        </div>
        <div className="flex flex-1 flex-col justify-between py-1 text-neutral-800">
          <p>{review.text}</p>
        </div>
      </div>
      <div className="flex items-center justify-end gap-1">
        <div className="flex items-center gap-2">
          <div className="h-[1.5rem] w-[1.5rem] rounded-full bg-neutral-200"></div>
          <span className="text-sm font-medium">Anonymous</span>
        </div>
        <span className="text-neutral-500">·</span>
        <span className="text-sm text-neutral-500">
          {dayjs(review.updatedAt).format('YYYY.MM.DD (ddd) A hh시 mm분')}
        </span>
      </div>
    </li>
  );
};

export default ReviewItem;
