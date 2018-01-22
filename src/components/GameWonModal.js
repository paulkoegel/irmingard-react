import React from 'react';
import schmiedelgard from 'images/restricted/schmiedelgard_small.jpg';

export default class GameWonModal extends React.Component {
  render () {
    return (
      <div className='GameWonModal'>
        <div className='GameWonModal_text'>
          <h1>Super, das geht auf!</h1>
        </div>
        <div className='GameWonModal_imageWrapper'>
          <img src={schmiedelgard} className='GameWonModal_image' alt='schmiedelgard' />
        </div>
      </div>
    );
  }
}
