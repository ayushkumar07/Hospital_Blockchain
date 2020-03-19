import React, {Component} from 'react';

class Register_Patient extends Component {
	 render() {

    return (
    	<div>
    	<div>
        <h3> Register Patient </h3>
         <form onSubmit={(event) => {
                  event.preventDefault()
                  const Name = this.name.value
                  const Dob = this.dob.value
                  const BloodGrp = this.bloodgrp.value
                  this.props.Register(Name, Dob, BloodGrp)
                }}>
              <label> Name : 
                <input
                    id="name"
                    type="text"
                    ref={(input) => { this.name = input }}
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
        </div>   
    	</div>
    );
  }
}

export default Register_Patient;