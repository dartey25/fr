import { Svg } from "./error";

interface ErrorFallbackProps {
  message?: string;
  onReset?: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = (props) => {
  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-3/4 tw-w-full">
      <Svg  />
      <p className="tw-text-slate-500 tw-mt-3">
        {props.message ?? "Сталася помилка"}
      </p>
    </div>
  );
};
