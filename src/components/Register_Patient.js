import React, {Component} from 'react';

class Register_Patient extends Component {

  constructor(props){
    super(props);
    this.state ={
      print : <div></div>
    }
  }

	 render() {

    return (
    	<div>
    	<div>
        <h3> Register Patient </h3>
         <form onSubmit={(event) => {
                  event.preventDefault()
                  const Name = this.name.value
                  const _id = Number(this._id.value)
                  const Dob = this.dob.value
                  const BloodGrp = this.bloodgrp.value

                  this.props.CheckID(_id)
                  .then((result) =>{
                     if(result === false){
                        this.setState({displayit : <div></div>})
                        this.props.Register(Name,_id, Dob, BloodGrp)
                      }
                      else{
                        this.setState({print : <h5>This Unique ID already exits in our system!!! </h5> })
                      }
                  })

                  
                }}>
              <label> Name : 
                <input
                    id="name"
                    type="text"
                    ref={(input) => { this.name = input }}
                    required />
               </label>
               <label> Unique ID No.:
                <input
                    id = "_id"
                    type="text"
                    ref={(input) => {this._id = input}}
                    required />
               </label>
               <label> Date Of Birth :                 
                 <input
                    id="dob"
                    type="Date"
                    ref={(input) => { this.dob = input }}
                    required />
               </label>

               <label> Blood Group :
                <input
                    id="bloodgrp"
                    type="text"
                    ref={(input) => { this.bloodgrp = input }}
                    required />
               </label>
          <button type="submit">SUBMIT</button>
         </form>
         {this.state.print}
        </div>   
    	</div>
    );
  }
}

export default Register_Patient;