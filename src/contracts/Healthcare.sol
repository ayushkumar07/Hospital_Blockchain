pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Healthcare{
    mapping(address => bool) private owners;
    struct person{
        string name;
        string age;
        string gender;
        string bloodgrp;
    }
    struct links{
        string [] hash;
    }
    
    mapping(uint256 => person) private patient;
    mapping(uint256 => links) private hashes; 
    mapping(uint256 => bool) private check;
    
    constructor() public {
        owners[msg.sender] = true;
        id = 1000;
    } 
    
    modifier onlyOwner {
        require(owners[msg.sender] == true);
        _;
    }
    uint256 private id;
    
    function checkOwner() public view returns(bool _own){
        if(owners[msg.sender]){
        return true;
    }
        
        return false;
    }
    
    function addPatient(string memory _name, string memory _dob, string memory _gender, string memory _bloodgrp) public onlyOwner{
        id++ ;
        patient[id] = person(_name,_dob, _gender, _bloodgrp);
        check[id] = true;
    }
    
    function checkID(uint256 _id) public view returns(bool _checkid){
        if(check[_id]){
        return true;
        }
        return false;
    }
    
    function addRecords(uint256 _id, string memory _hash) public onlyOwner {
        require(check[_id]);
        hashes[_id].hash.push(_hash);
    }
    
    function retrieve(uint256 _id)public view onlyOwner returns(string memory _name , string memory _age, string memory _gender, string memory _bloodgrp, string [] memory _hashes){
        require(check[_id]);
        person memory P = patient[_id];
        return (P.name, P.age, P.gender, P.bloodgrp,hashes[_id].hash);
    } 
    
}