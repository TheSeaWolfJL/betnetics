import { NotFoundIcon } from '@/components/icons';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col">
      <h1>Ooops!</h1>
      <p>Page not found</p>
      <NotFoundIcon className="pointer-events-none flex-shrink-0" />
    </div>
  );
};

export default NotFoundPage;
