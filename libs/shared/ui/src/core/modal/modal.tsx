import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../dialog";
import { ModalStore } from "./store/query";
import { StatusModalStore, useStatusModal } from "./store/status";
import { Loader } from "@mdoffice/md-component-react";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "../error";
import { Button } from "../button";

function Modal(props: ModalStore) {
  return (
    <DialogContent
      className="sm:max-w-[425px]"
      onDismiss={() => props.dismiss()}
    >
      <DialogHeader>
        {props.title && <DialogTitle>{props.title}</DialogTitle>}
        {props.description && (
          <DialogDescription>{props.description}</DialogDescription>
        )}
      </DialogHeader>
      {props.content && props.content({})}
    </DialogContent>
  );
}

interface IContentProps {
  queryOptions?: UseQueryOptions;
  contentFn: React.FC<{ data: unknown } | any>;
}

const ModalContent = ({ queryOptions, contentFn: Content }: IContentProps) => {
  if (queryOptions) {
    return (
      <ModalContentWithQuery queryOptions={queryOptions} contentFn={Content} />
    );
  }

  return <ModalContentWithoutQuery contentFn={Content} />;
};

const ModalContentWithQuery = ({
  queryOptions,
  contentFn: Content,
}: Required<IContentProps>) => {
  const { data, isError, error, isLoading, refetch } = useQuery(queryOptions);

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  if (isError) {
    return <ErrorFallback message={error.message} />;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <ErrorBoundary
      fallbackRender={({ error }) => <ErrorFallback message={error.message} />}
    >
      {data ? (
        <Content data={data} />
      ) : (
        <ErrorFallback message={"Дані відсутні"} />
      )}
    </ErrorBoundary>
  );
};

const ModalContentWithoutQuery = ({
  contentFn: Content,
}: {
  contentFn: React.FC;
}) => {
  return (
    <ErrorBoundary
      fallbackRender={({ error }) => <ErrorFallback message={error.message} />}
    >
      <Content />
    </ErrorBoundary>
  );
};

function StatusModal(props: StatusModalStore) {
  return (
    <DialogContent
      className="!tw-w-auto !tw-min-w-[500px] !tw-h-min"
      onDismiss={() => props.dismiss()}
    >
      {/* <DialogHeader>
          {props.title && <DialogTitle>{props.title}</DialogTitle>}
          {props.description && (
            <DialogDescription>{props.description}</DialogDescription>
          )}
        </DialogHeader> */}
      <StatusModalContent />
    </DialogContent>
  );
}

const StatusModalContent = () => {
  const { status, dismiss, onCloseCallback, onSuccessCallback } =
    useStatusModal();

  if (!status) {
    dismiss();
    return null;
  }

  if (status === "error") {
    return <Error onClose={dismiss} />;
  }

  if (status === "pending") {
    return (
      <div className="tw-h-full tw-pt-10">
        <Loader />
      </div>
    );
  }

  if (status === "success") {
    return (
      <Success
        onClose={() => {
          dismiss();
          onCloseCallback && onCloseCallback();
        }}
        onSubmit={() => {
          dismiss();
          onSuccessCallback && onSuccessCallback();
        }}
      />
    );
  }

  return null;
};

const Success = (props: { onClose: () => void; onSubmit: () => void }) => {
  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-justify-start tw-pt-1 tw-h-full tw-w-full">
      <span
        role="img"
        className="anticon anticon-check-circle tw-text-green-500"
      >
        <svg
          viewBox="64 64 896 896"
          focusable="false"
          data-icon="check-circle"
          className="tw-h-20 tw-w-20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path>
        </svg>
      </span>
      <div className="tw-text-xl tw-font-medium tw-mt-4">
        Успішно збережено!
      </div>
      <div className="tw-text-xs tw-text-gray-500 tw-mt-2">
        Сертифікат можна буде відредагувати або роздрукувати в будь який час.
      </div>
      <div className="tw-flex tw-gap-x-2 tw-mt-5">
        <Button variant="light" onClick={props.onClose}>
          До головного меню
        </Button>
        <Button variant="default" onClick={props.onSubmit}>
          Створити новий
        </Button>
      </div>
    </div>
  );
};

const Error = (props: { onClose: () => void; onSubmit?: () => void }) => {
  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-justify-start tw-pt-2 tw-h-full tw-w-full">
      <span
        role="img"
        className="anticon anticon-check-circle tw-text-amber-500"
      >
        <svg
          viewBox="64 64 896 896"
          focusable="false"
          data-icon="warning"
          width="1em"
          height="1em"
          className="tw-h-20 tw-w-20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M955.7 856l-416-720c-6.2-10.7-16.9-16-27.7-16s-21.6 5.3-27.7 16l-416 720C56 877.4 71.4 904 96 904h832c24.6 0 40-26.6 27.7-48zM480 416c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v184c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V416zm32 352a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"></path>
        </svg>
      </span>
      <div className="tw-text-xl tw-font-medium tw-mt-4">
        Виникли проблеми при збереженні.
      </div>
      <div className="tw-flex tw-gap-x-2 tw-mt-5">
        <Button variant="light" onClick={props.onClose}>
          Закрити
        </Button>
        {props.onSubmit && (
          <Button variant="default" onClick={props.onSubmit}>
            Створити новий
          </Button>
        )}
      </div>
    </div>
  );
};

export { Modal, ModalContent, StatusModal };
