import React, {Component} from 'react';

class AddToIpfs extends Component {
	 render() {

    return (
    	<div>
    	<div>
        <h3> Add Records </h3>
         <form onSubmit={(event) => {
                  event.preventDefault()
                  const content = this.patient.value
                  this.props.onSubmit(content)
                }}>

                 <input type='file' onChange={this.props.captureFile} required/>
                <input
                    id="patient"
                    type="text"
                    ref={(input) => { this.patient = input }}
                    className="form-control"
                    placeholder="Enter Patient ID"
                    required />
          <button type="submit">SUBMIT</button>
         </form>
        </div>   
    	</div>
    );
  }
}

export default AddToIpfs;