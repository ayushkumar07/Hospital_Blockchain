pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Healthcare{
    mapping(address => bool) private owners;
    struct person{
        string name;
        string age;
        string bloodgrp;
    }
    struct links{
        string [] hash;
        string [] time;
        address [] hospital;
    }
    struct hospital_data {
        string hosp_name;
        string hosp_add;
        string hosp_city;
        string hosp_country;
    }
    
    mapping(uint256 => person) private patient;
    mapping(uint256 => links) private hashes; 
    mapping(uint256 => bool) private check;
    mapping (address => hospital_data) private Hospital_Info;
    
    constructor() public {
        owners[msg.sender] = true;
        Hospital_Info[msg.sender] = hospital_data("Contract Initialiser" ,"Dwarka Sector - 1","New Delhi","India");
        
        address temp = 0x318E57a2e28868B100Aad751eeF1136E854e765a;
        owners[temp] = true;
        Hospital_Info[temp] = hospital_data("Deen Dayal Upadhayay Hospital", "Tilak Nagar","New Delhi","India");
        
        temp = 0x692991888659c3e8Ad043B262B0AF97415eA4aDB;
        owners[temp] = true;
        Hospital_Info[temp] = hospital_data("Maharaja Agrasen Hospital","Dwarka Sector - 1","New Delhi","India");

        temp = 0x47bAD77AE2ad383d1ec9aFCD126d3B8629FF1BB0;
        owners[temp] = true;
        Hospital_Info[temp] = hospital_data("Fortis Hospital","Bandra","Mumbai","India");

        temp = 0x246DBf38765Ab779a53c4DB220df5DB83Af8B211;
        owners[temp]= true;
        Hospital_Info[temp] = hospital_data("World Health Organisation","City Park","New York","United States Of America");
    } 
    
    modifier onlyOwner {
        require(owners[msg.sender] == true);
        _;
    }

    
    function checkOwner() public view returns(bool _own){
        if(owners[msg.sender]){
        return true;
    }
        return false;
    }
    function HospitalDetail (address Add) public view returns(string memory hname, string memory hadd, string memory hcity, string memory hcountry){
        hospital_data memory H = Hospital_Info[Add];
        return (H.hosp_name,H.hosp_add, H.hosp_city, H.hosp_country);        
    }
    
    function addPatient(uint256 _id, string memory _name, string memory _dob, string memory _bloodgrp) public onlyOwner{
        patient[_id] = person(_name,_dob, _bloodgrp);
        check[_id] = true;
    }
    
    function checkID(uint256 _id) public view returns(bool _checkid){
        if(check[_id]){
        return true;
        }
        return false;
    }
    
    function addRecords(uint256 _id, string memory _hash, string memory _time) public onlyOwner {
        require(check[_id]);
        hashes[_id].hash.push(_hash);
        hashes[_id].time.push(_time);
        hashes[_id].hospital.push(msg.sender);
    }
    
    function retrieve(uint256 _id)public view onlyOwner returns(string memory _name , string memory _age, string memory _bloodgrp, string [] memory _hashes, string [] memory _time, address [] memory _hospital){
        require(check[_id]);
        person memory P = patient[_id];
        return (P.name, P.age, P.bloodgrp,hashes[_id].hash, hashes[_id].time, hashes[_id].hospital);
    } 
    
}