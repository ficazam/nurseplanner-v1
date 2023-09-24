import React from "react";

const Button = (
  props: Partial<React.ButtonHTMLAttributes<HTMLButtonElement>>
) => {
  return (
    <button
      type={props.type}
      onClick={(e) => props.onClick?.(e)}
      className={`bg-slate-800 border border-white text-white h-14 w-32 rounded-md font-semibold ${
        props.disabled && "cursor-not-allowed pointer-events-none opacity-50"
      } ${props.className}`}
    >
      {props.children}
    </button>
  );
};

export const CancelButton = (
  props: Partial<React.ButtonHTMLAttributes<HTMLButtonElement>>
) => {
  return (
    <button
      type={props.type}
      onClick={(e) => props.onClick?.(e)}
      className={`bg-slate-500 border border-white text-colour-6 h-14 w-32 rounded-md font-semibold ${props.className}`}
    >
      {props.children}
    </button>
  );
};

export default Button;
