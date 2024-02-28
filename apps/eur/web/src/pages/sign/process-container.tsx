import { Loader } from "@mdoffice/md-component-react";

export function ProcessContainer(props: {
  children?: React.ReactNode;
  loaderText?: string | null;
  statusText?: string;
  statusError?: boolean;
  prevText?: string;
  onPrevClick?: () => void;
  nextText?: string;
  nextDisabled?: boolean;
  onNextClick?: () => void;
}) {
  return (
    <div>
      {props.loaderText && <Loader text={props.loaderText} />}
      {!props.loaderText && (
        <div>
          {props.statusText && (
            <div
              className={
                "alert border-0 font-weight-bold font-size-lg " +
                (props.statusError ? "alert-danger" : "alert-success")
              }
              dangerouslySetInnerHTML={{ __html: props.statusText }}
            />
          )}

          <div>{props.children}</div>
        </div>
      )}

      <div className="row ">
        <div className="offset-3 col-9">
          {props.prevText && props.onPrevClick && (
            <button
              type="button"
              className="btn btn-light mr-2"
              onClick={() => {
                props.onPrevClick && props.onPrevClick();
              }}
              disabled={!!props.loaderText}
            >
              {props.prevText}
            </button>
          )}
          {props.nextText && props.onNextClick && (
            <button
              type="button"
              className="btn btn-primary mr-2"
              onClick={() => {
                props.onNextClick && props.onNextClick();
              }}
              disabled={!!props.loaderText || props.nextDisabled}
            >
              {props.nextText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
