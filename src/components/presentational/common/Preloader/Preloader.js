import React from 'react';

const Preloader = () => {

  return (
    <div className="preloader">
      <img className="preloader__image" src={require('./images/ajax_birdie.gif')} />
    </div>
  );
};

export default Preloader;
