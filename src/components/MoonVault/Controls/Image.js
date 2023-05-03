import React from 'react';

export const Image = (props) => {
  const { className, src } = props;
  const cn = `Image ${className || ''}`;

  return (
    <>
      <img className={cn} src={src} alt="" />
    </>
  );
};
