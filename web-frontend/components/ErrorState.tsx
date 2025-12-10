export default function ErrorState({
  message = "Something went wrong",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4 max-w-md">
        <div className="text-red-500 text-5xl">⚠️</div>
        <h3 className="text-xl font-semibold text-text-primary">{message}</h3>
        <p className="text-text-secondary">
          Please try again later or contact support if the problem persists.
        </p>
        {onRetry && (
          <button onClick={onRetry} className="btn-primary mt-4">
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
