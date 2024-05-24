'use client';

import ErrorDisplay from '@/components/error-display';

const NotFound = () => {
  return (
    <div className=" flex h-full w-full items-center justify-center">
      <ErrorDisplay
        title="404"
        message="Sorry, Page not found"
        buttonText="Go back"
        action={() => window.history.back()}
      />
    </div>
  );
};

export default NotFound;
