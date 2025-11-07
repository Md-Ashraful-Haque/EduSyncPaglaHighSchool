
import './loadingPage.scss';
import Loading_1 from 'LoadingComponent/loading/Loading_1';
// import Loading_1 from '../../components/loading/Loading_1';
const LoadingPage = () => {
  return (
    <div className="loading-page">
      
      <div className='max-w-[500px] min-h-[500px] mx-auto flex items-center justify-center'>
        <Loading_1/>
      </div>
    </div>
  );
};


export default LoadingPage;