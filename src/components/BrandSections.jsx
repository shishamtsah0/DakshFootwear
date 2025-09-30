import BestSection from './BestSection';
import WalkarooSection from './WalkarooSection';
import ActionSection from './ActionSection';
import BrilliantSection from './BrilliantSection';
import ChineseSection from './ChineseSection';

const BrandSections = () => {
  return (
    <div className="py-16">
      <BestSection />
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-6"></div>
      <WalkarooSection />
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-6"></div>
      <ActionSection />
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-6"></div>
      <BrilliantSection />
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-6"></div>
      <ChineseSection />
    </div>
  );
};

export default BrandSections;