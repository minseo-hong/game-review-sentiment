import GameInfoSection from '../components/section/GameInfoSection';
import ReviewSection from '../components/section/ReviewSection';

const GameDetail = () => {
  return (
    <div className="px-6 pb-24 pt-8">
      <div className="mx-auto flex max-w-screen-md flex-col gap-12">
        <GameInfoSection />
        <ReviewSection />
      </div>
    </div>
  );
};

export default GameDetail;
