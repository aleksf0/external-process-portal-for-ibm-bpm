import React from 'react';

const Preloader = () => {

  return (
    <div className="preloader">
      <img className="preloader__image" src={require('./spinner-blue.gif')} />
    </div>
  );
};

export default Preloader;
