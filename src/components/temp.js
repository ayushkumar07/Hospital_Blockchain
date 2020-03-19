import React, { Component } from 'react'
import ipfs from './ipfs'
import Web3 from 'web3'
import Healthcare from '../abis/Healthcare.json'
 
class App extends Component {

  async componentWillMount() {
    // Detect Metamask
    const metamaskInstalled = typeof window.web3 !== 'undefined'
    this.setState({ metamaskInstalled : metamaskInstalled })
    if(metamaskInstalled) {
      await this.loadWeb3()
      await this.loadBlockchainData()
      await this.setState({loading : false})
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
      
    //   const pp = this.state.healthcare.methods.retrieve(1004).call({ from: this.state.account })
    //   console.log(pp)
    //       const ttt = await this.state.healthcare.methods.retrieve(1001).call({from: this.state.account})
    // await console.log(ttt._hashes[ttt._hashes.length - 1]);
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
      name:null,
      date: null,
      gender:null,
      blood: null,
      ipfsLink: 'https://ipfs.infura.io/ipfs/'
    }
  }



captureFile = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }

  }

  onSubmit = (event) => {
    event.preventDefault()
    console.log("Submitting file to ipfs...")
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result)
      if(error) {
        console.error(error)
        return
      }
       this.state.healthcare.methods.addRecords(this.state.Patient_id,this.state.ipfsLink+result[0].hash).send({ from: this.state.account }).then((r) => {
         return this.setState({ Hash: result[0].hash })
       })
    })  
  }
  updateID = (event) => {
    event.preventDefault()
    this.setState({Patient_id : Number(event.target.value) })

  }
  updateName = (event)=>{
    event.preventDefault()
    this.setState({name: event.target.value})
  }
  updateDate = (event)=>{
    event.preventDefault()
    this.setState({date : event.target.value})
  }
  updateGender = (event)=>{
    event.preventDefault()
    this.setState({gender: event.target.value})
  }
  updateBlood = (event)=>{
    event.preventDefault()
    this.setState({blood : event.target.value})
  }
  Register = (event)=>{
    event.preventDefault()
     this.state.healthcare.methods.addPatient(this.state.name,this.state.date,this.state.gender, this.state.blood).send({from :this.state.account})
     this.setState({afterRegister : <h3> Updated Successfully </h3> })    
  }
  Retrieve = async(event) =>{
    await event.preventDefault()
    await this.setState({Retrieved : this.state.healthcare.methods.retrieve(this.state.Patient_id).call({from : this.state.account}) })
  }
  canBeSubmitted()
  {
     if(this.state.name ===null || this.state.date ===null || this.state.gender === null || this.state.blood===null){
      return false;
     }
     if(this.state.name.length > 0 && (this.state.gender ==='Male' ||this.state.gender==='Female') && this.state.blood.length > 0){
      return true;
     }
     else{
      return false;
     }
  }



  render() {
  let content
  let loading
  let metaInstall
  let isEnabled = this.canBeSubmitted();

    if(this.state.metamaskInstalled === false && this.state.loading === false){
      window.alert('Install Metamask!!!')
      content = <h1> Please Install Metamask !!! Reload After Installing</h1>
    }
      if(this.state.loading) {
      loading = <div ><p>Loading...</p></div>
    } 

    else if(this.state.loading === false && this.state.metamaskInstalled === true){
      if(this.state.owner === true){


      content = <h3> Hello Hospital!!! </h3>
        
    } else {
      content = <h2> Hello Customer </h2>
    }
  }

  

    return (      

        <div>
           <p>  {this.state.account}</p>
           {metaInstall}
           { this.state.loading ? loading : content  } 

           <div>      
        <div>
        <h3> Add Records </h3>
         <form onSubmit={this.onSubmit} >
          
            <input type='file' onChange={this.captureFile} />
          <label> Patient ID </label>
            <input type='text' onChange={this.updateID} />
            <h1>  </h1>
            <input type='submit' />
          </form>
        </div>   
        <div>
          <h3> Register Patient </h3>
          <form onSubmit = {this.Register} >
            <label> Name: <input type='Text' onChange ={this.updateName} /> </label>
            <label> Date of Birth: <input type='Date' onChange ={this.updateDate} /> </label>
            <label> Gender: <input type='Text' onChange ={this.updateGender} /> </label>
            <label> BloodGroup: <input type='Text' onChange ={this.updateBlood} /> </label>
            <button disabled= {!isEnabled}> Submit </button>
            
          </form>
          {this.state.afterRegister}
        </div>  

        <div>
          <h3> Retrieve Patient's Medical History </h3>
          <form onSubmit = {this.Retrieve} >
            <label> Patient ID <input type ='Text' onChange = {this.updateID} /> </label>
            <button> Submit </button>
          </form>
          
          { this.state.Retrieved ? <div> 
            <h4> Retrieved Medical History of Patient {this.state.Patient_id} is :</h4>
                <div>
                   <h3> Name : {this.state.Retrieved._age} </h3>
                   {console.log(this.state.Retrieved)}
                 </div>
            </div> : <h2> ksksks </h2>
          }

        </div>
        </div>

         
        </div> 
    );
  }
}
 
export default App;