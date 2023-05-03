import { forwardRef } from 'react';

function Group(props, ref) {
  const { className, children } = props;
  const cn = `Group ${className || ''}`;

  const p = {};
  for (let i = 0, k = Object.keys(props); i < k.length; i += 1) {
    const key = k[i];
    // eslint-disable-next-line react/destructuring-assignment
    const val = props[key];

    if (key !== 'className' && key !== 'children') {
      p[key] = val;
    }
  }

  return (
    <div ref={ref} className={cn} {...p}>
      {children}
    </div>
  );
}

export default forwardRef(Group);
