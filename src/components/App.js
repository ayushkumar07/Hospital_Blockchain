import React, { Component } from 'react'
import ipfs from './ipfs'
import Web3 from 'web3'
import Healthcare from '../abis/Healthcare.json'
import AddToIpfs from './AddToIpfs'
import Register_Patient from './Register_Patient'
import Display_Data from './Display_Data';
 
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
      metamaskInstalled: false,
      buffer : null,
      p_id : null,
      ipfsLink: 'https://ipfs.infura.io/ipfs/'
    }
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.Register = this.Register.bind(this);
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
       this.state.healthcare.methods.addRecords(Number(event),this.state.ipfsLink+result[0].hash).send({ from: this.state.account })
       .once('receipt', (receipt) => {
        window.alert('Medical History Updated Successfully')
          this.setState({ Hash: result[0].hash })
       })
       this.setState({loading : false})
    })  
  
  }

  Register(name , dob, gender, bloodgrp){
    this.state.healthcare.methods.addPatient(name,dob,gender,bloodgrp).send({from :this.state.account}) 
  }


  render() {
  let content
  let loading
  let retrieve
    if(this.state.metamaskInstalled === false && this.state.loading === false){
      window.alert('Install Metamask!!!')
      content = <h1> Please Install Metamask !!! Reload After Installing</h1>
    }
      if(this.state.loading) {
      loading = <div ><h1>Loading... And Make Sure MetaMask is Installed</h1></div>
    } 

    else if(this.state.loading === false && this.state.metamaskInstalled === true){
      if(this.state.owner === true){


      content = <div> <h3> Hello Hospital!!! </h3>
            <div>

              <Register_Patient
                  Register = {this.Register} />
            </div>
             
            <div>
             <AddToIpfs
                  Patient_id = {this.state.Patient_id}
                  buffer ={this.state.buffer}
                  captureFile={this.captureFile}
                  onSubmit={this.onSubmit} />
            </div>
            <div>
              <h3> Retrieve Patient's Medical History </h3>
              <form onSubmit = {(event)=>{
                event.preventDefault()
               this.setState({p_id : Number(this.p_id.value)})
              }} >
                <input id="p_id"
                  type = "text" 
                  ref={(input) => { this.p_id = input }}
                  placeholder="Enter Patient ID"
                  required />
                  <button type="submit">SUBMIT</button>
              </form>
              {this.state.p_id ?
                <Display_Data
                    healthcare = {this.state.healthcare} 
                    p_id = {this.state.p_id}
                    account ={this.state.account} /> : <div>  </div>
              }
            </div>
          </div>
                  
        
    } else {
      content = <h2> Hi, Seems that your Unique address does not have a permission to enter further. </h2>
    }
  }

  

    return (      

        <div>
           <p>  Your Unique Address : {this.state.account}</p>

           { this.state.loading ? loading : content } 
           
        </div> 
    );
  }
}
 
export default App;