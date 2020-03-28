import React, { Component } from 'react';
import metamaskLogo from '../metamask.png';

class MetamaskAlert extends Component {

  render() {
    return (
      <div className="my-5 text-center">
        <img src={metamaskLogo} width="250" class="mb-4" alt=""/>
        <h1>Please Install Metamask</h1>
        <a href ="https://metamask.io/"> Click Here to Install </a>
      </div>
    );
  }
}

export default MetamaskAlert;