import React, {Component} from 'react';

class Display_Data extends Component {
  async componentWillMount(){
    this.props.healthcare.methods.retrieve(this.props.p_id).call({from : this.props.account})
    .then((result) => {
      this.setState({retrieved : result})
    })
    
  }

  constructor(props){
    super(props)
    this.state = {

    }
  }
	 render() {

    return (
    	<div>
    	<div>
        <h3> Medical History of Patient ID:  </h3>
      
        {this.state.retrieved ? 
          <div>
          <div> <h4>Name: {this.state.retrieved._name} </h4> 
          <h4> Date Of Birth : {this.state.retrieved._age} </h4>
          <h4> Gender : {this.state.retrieved._gender} </h4>
          <h4> Blood Group : {this.state.retrieved._bloodgrp}</h4></div>

            <tbody>
               { this.state.retrieved._hashes.map((product, key) => {
              return(
                <tr key={key}>
                  <td><a href={product}>History Link</a> </td>
                </tr>
              )
            } ) }
            </tbody>
            
          </div>
          : <div>  </div>
        }
        </div>   
    	</div>
    );
  }
}

export default Display_Data;