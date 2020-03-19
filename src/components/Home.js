import React, {Component} from 'react';

class Display_Data extends Component {
	 render() {
    let hashes = this.props.retrieve._hashes
    return (
    	<div>
    	<div>
        <h3> Medical History of Patient ID:  </h3>
        
        </div>   
    	</div>
    );
  }
}

export default Display_Data;