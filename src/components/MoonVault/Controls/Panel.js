// components
import Group from './Group';

export const Panel = (props) => {
  const { className, children } = props;
  const cn = `Panel ${className || ''}`;
  return <Group className={cn}>{children}</Group>;
};

export default Panel;
