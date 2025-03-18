import React from "react";
import cx from "clsx";

export function Title({
  className,
  order = 1,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { order?: 1 | 2 | 3 }) {
  if (order === 1)
    return (
      <h1 className={cx("text-4xl font-bold mb-2", className)} {...props} />
    );
  if (order === 2)
    return (
      <h2 className={cx("text-3xl font-bold mb-2", className)} {...props} />
    );
  if (order === 3)
    return (
      <h3 className={cx("text-2xl font-bold mb-2", className)} {...props} />
    );
  return <div className={className} {...props} />;
}
