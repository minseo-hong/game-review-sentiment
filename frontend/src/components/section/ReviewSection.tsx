import ReviewCommentForm from '../form/ReviewCommentForm';
import ReviewList from '../review/ReviewList';

const ReviewSection = () => {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-medium">Reviews</h1>
      <ReviewCommentForm />
      <ReviewList />
    </section>
  );
};

export default ReviewSection;
