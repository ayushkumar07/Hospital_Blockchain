import React, {Component} from 'react';

class AddToIpfs extends Component {

  constructor(props){
    super(props)
    this.state ={
      print : false,
      valid : false,
    }
  }
	 render() {
    let print = false;
    return (
    	<div>
    	<div>
        <h3> Add Records </h3>
         <form onSubmit={(event) => {
                  event.preventDefault()
                  this.props.CheckID(Number(this.patient.value))
                  .then((result) =>{
                     if(result === true){
                        this.setState({print :false})
                        const content = this.patient.value
                        this.props.onSubmit(content)
                      }
                      else{
                        this.setState({print : true })
                      }
                  })
                  
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
         {this.state.print ?
          <h5>Invalid Patient ID!!! </h5> : <div></div>
        }
        </div>   
    	</div>
    );
  }
}

export default AddToIpfs;