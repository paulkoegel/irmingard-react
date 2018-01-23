import React from 'react';
import schmiedelgard from 'images/restricted/schmiedelgard_small.jpg';

export default class GameWonModal extends React.Component {
  state = {
    isHidden: false
  };

  render () {
    const classNames = [
      'GameWonModal',
      this.state.isHidden && 'isHidden'
    ].filter(e => e).join(' ');
    return (
      <div className={classNames}>
        <button className='GameWonModal_close' onClick={() => { this.setState(state => ({ isHidden: true })); }}>X</button>
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
