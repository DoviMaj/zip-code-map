"use client";

export const LoadingSpinner = () => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-white border-t-transparent"></div>
    </div>
  );
};
