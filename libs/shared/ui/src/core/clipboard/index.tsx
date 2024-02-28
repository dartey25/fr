import { CopyIcon } from "@radix-ui/react-icons";

export function Clipboard(props: { content: string; onClick: () => void }) {
  return (
    <span title="Копіювати" onClick={props.onClick}>
      <CopyIcon className="tw-ml-2 tw-text-gray-400 tw-cursor-pointer" />
    </span>
  );
}
