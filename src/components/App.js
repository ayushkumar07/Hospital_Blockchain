import React, { Component } from 'react'
import ipfs from './ipfs'
import Web3 from 'web3'
import Healthcare from '../abis/Healthcare.json'
import AddToIpfs from './AddToIpfs'
import Register_Patient from './Register_Patient'
import Display_Data from './Display_Data'
import Hospital from './Hospital'
import Metamask from './Metamask'
 
class App extends Component {

  async componentWillMount() {
    // Detect Metamask
    const metamaskInstalled = typeof window.web3 !== 'undefined'
    this.setState({ metamaskInstalled : metamaskInstalled })
    if(metamaskInstalled) {
      await this.loadWeb3()
      await this.loadBlockchainData()
    }
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      // DO NOTHING...
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()

    const networkData = Healthcare.networks[networkId]
    if(networkData){
      const healthcare = await web3.eth.Contract(Healthcare.abi, networkData.address)
      this.setState({ healthcare })
      this.state.Hospital_Details = await this.state.healthcare.methods.HospitalDetail(this.state.account).call({from : this.state.account})
      this.state.owner = await this.state.healthcare.methods.checkOwner().call({from: this.state.account})
      this.setState({loading : false})
       }
    else{
      window.alert('Contract not deployed to detected network. Try changing it to Ropsten network')
    }

  }

    constructor(props) {
    super(props)
    this.state = {
      account: '',
      owner: false,
      loading: true,
      Hospital_Details : null,
      metamaskInstalled: false,
      buffer : null,
      print : false,
      display_msg : <h5></h5>,
      ipfsLink: 'https://ipfs.infura.io/ipfs/'
    }
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.Register = this.Register.bind(this);
    this.HospitalInformation = this.HospitalInformation.bind(this);
    this.CheckID = this.CheckID.bind(this);
  }



captureFile(event){
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }

  }

  onSubmit(event){
    this.setState({loading : true})
    console.log("Submitting file to ipfs...")
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result)
      if(error) {
        console.error(error)
        return
      }
       this.state.healthcare.methods.addRecords(Number(event),this.state.ipfsLink+result[0].hash, (new Date()).toString()).send({ from: this.state.account })
       .once('receipt', (receipt) => {
        window.alert('Medical History Updated Successfully')
          this.setState({ Hash: result[0].hash })
       })
       this.setState({loading : false})
    })  
  
  }

  Register(name , _id, dob, bloodgrp){
    this.setState({loading : true})
    console.log("Registering Patient Details")
    this.state.healthcare.methods.addPatient(_id,name,dob,bloodgrp).send({from :this.state.account}) 
    this.setState({loading : false})
  }

  HospitalInformation(address){
    this.setState({loading : true})
    console.log("Fetching Hospital Details")
    const temp = this.state.healthcare.methods.HospitalDetail(address).call({from : this.state.account})
    this.setState({Hospital_Info : temp})
    this.setState({loading : false})
  }

  CheckID(p_id){
      const temp = this.state.healthcare.methods.checkID(p_id).call({from : this.state.account})
      return temp;  
  }

  render() {
  let content
  let loading
    if(this.state.metamaskInstalled === false && this.state.loading === false){
      window.alert('Install Metamask!!!')
      content = <h1> Please Install Metamask !!! Reload After Installing</h1>
    }
      if(this.state.loading) {
      loading = <div className="my-5 text-center"><h1>Loading... And Make Sure MetaMask is Installed</h1></div>
    } 

    else if(this.state.loading === false && this.state.metamaskInstalled === true){
      if(this.state.owner === true){


      content = <div>
                 <p>  Your Unique Address : {this.state.account}</p>

       <h3> Welcome {this.state.Hospital_Details.hname}!!! </h3>
      <p> Address : {this.state.Hospital_Details.hadd}, {this.state.Hospital_Details.hcity}, {this.state.Hospital_Details.hcountry} </p>

            <div>

              <Register_Patient
                  Register = {this.Register}
                  CheckID = {this.CheckID} />
            </div>
            <div>
             <AddToIpfs
                  Patient_id = {this.state.Patient_id}
                  buffer ={this.state.buffer}
                  captureFile={this.captureFile}
                  onSubmit={this.onSubmit}
                  CheckID ={this.CheckID} 
                  healthcare={this.state.healthcare}/>
            </div>


            <div>
              <h3> Retrieve Patient's Medical History </h3>
              <form onSubmit = {(event)=>{
                event.preventDefault()
                this.CheckID(Number(this.p_id.value))
                  .then((result) =>{
                     if(result === true){
                        this.setState({print :true,
                          display_msg : <h5></h5>,
                          p_id : Number(this.p_id.value)
                        })
                      }
                      else{
                        this.setState({print : false ,
                          display_msg : <h5>Invalid Patient ID</h5>
                        })
                      }
                  })
              }} >
                <input id="p_id"
                  type = "text" 
                  ref={(input) => { this.p_id = input }}
                  placeholder="Enter Patient ID"
                  required />
                  <button type="submit">SUBMIT</button>
              </form>
              {this.state.print ?
                <Display_Data
                    healthcare = {this.state.healthcare} 
                    p_id = {this.state.p_id}
                    account ={this.state.account}
                    CheckID = {this.CheckID} /> : <div></div>
              }
              {this.state.display_msg}
            </div>
          </div>
                  
        
    } else {
      content =<div>
                 <p>  Your Unique Address : {this.state.account}</p>
           <h2> Hi, Seems that your Unique address does not have a permission to enter further. </h2>
           </div>
    }
  }

  

    return (      

        <div>
            { this.state.loading ? loading : content } 
           
           {this.state.account ?
          <div>
              <h3> Get Hospital's Details using its Unique Address </h3>
              <form onSubmit = {(event)=>{
                event.preventDefault()
               this.setState({h_id : this.h_id.value})
              }} >
                <input id="h_id"
                  type = "text" 
                  ref={(input) => { this.h_id = input }}
                  placeholder="E.g. 0x692991888659c3e8Ad043B262B0AF97415eA4aDB"
                  required />
                  <button type="submit">SUBMIT</button>
              </form>
              {this.state.h_id ?
                <Hospital
                    healthcare = {this.state.healthcare} 
                    h_id = {this.state.h_id}
                    account ={this.state.account} /> : <div>  </div>
              }
            </div>
            : <Metamask />
            }
        </div> 
    );
  }
}
 
export default App;