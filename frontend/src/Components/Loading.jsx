import React from 'react';

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-65 flex flex-col items-center justify-center z-50">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-purple-500 border-solid mb-4"></div>
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  );
};

export default Loading;
