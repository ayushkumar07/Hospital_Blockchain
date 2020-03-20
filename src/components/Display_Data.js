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
     let tt = []
     if(this.state.retrieved){
      for (var i = this.state.retrieved._hashes.length - 1; i >= 0; i--) {
        tt.push(<li> {this.state.retrieved._hospital[i]}, {this.state.retrieved._time[i]} , <a href={this.state.retrieved._hashes[i]}>History Link</a> </li>)
      }

    }
    return (
    	<div>
    	<div>
        <h3> Medical History of Patient ID: {this.props.p_id} </h3>
    
        {this.state.retrieved ? 
          <div>
          <div> <h4>Name: {this.state.retrieved._name} </h4> 
          <h4> Date Of Birth : {this.state.retrieved._age} </h4>
          <h4> Blood Group : {this.state.retrieved._bloodgrp}</h4></div>
          
          {tt}
            
          </div>
          : <div>  </div>
        }
        </div>   
    	</div>
    );
  }
}

export default Display_Data;