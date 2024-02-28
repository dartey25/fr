import * as React from "react";

import { cn } from "../../utils";
import { CreateOptions, useModalStore } from "../modal/store/query";
import { Object } from "ts-toolbelt";
import InputMask from "react-input-mask";

type InputPropsNoBtn = {
  withModal?: false;
  modalOptions?: never;
};

type InputPropsWithBtn = {
  withModal: true;
  modalOptions: CreateOptions;
};

export type InputProps = Object.Overwrite<
  React.InputHTMLAttributes<HTMLInputElement>,
  { value?: string | number | null }
> &
  (InputPropsNoBtn | InputPropsWithBtn) & {
    mask?: string;
    maskChar?: string
  };

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, withModal, modalOptions, ...props }, ref) => {
    const { create } = useModalStore();
    
    return withModal ? (
      <div className="input-group">
        <input
          className={cn("form-control ", className)}
          ref={ref}
          {...props}
          value={props.value === null ? undefined : props.value}
        />
        <div className="input-group-append">
          <button
            className="btn btn-light"
            onClick={() => create(modalOptions)}
          >
            Обрати
          </button>
        </div>
      </div>
    ) : (
      <InputBase {...props} ref={ref} />
    );
  },
);

const InputBase = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, mask, ...props }, ref) => {
    const Slot = mask ? InputMask : "input";
    return (
      <Slot
        {...props}
        className={cn("form-control ", className)}
        ref={ref}
        value={props.value === null ? undefined : props.value}
      />
    );
  },
);

Input.displayName = "Input";
InputBase.displayName = "InputBase";

export { Input };
