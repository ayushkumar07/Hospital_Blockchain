import React, {Component} from 'react';

class Hospital extends Component {
 async componentWillMount(){
    this.props.healthcare.methods.HospitalDetail(this.props.h_id).call({from : this.props.account})
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
        
        { 
          this.state.retrieved ? <div> <h5>Hospital Name:  {this.state.retrieved.hname} </h5>
          <h5>Hospital Address : {this.state.retrieved.hadd}, {this.state.retrieved.hcity}, {this.state.retrieved.hcountry} </h5>
          </div> : <h5> </h5>
        } 
    	</div>
    );
  }
}

export default Hospital;