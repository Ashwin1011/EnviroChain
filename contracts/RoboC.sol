pragma solidity 0.4.25;


contract Robo{
    
    struct sensordata{
        string temp;
        string humid;
    }

    mapping(uint => sensordata) public data;
    mapping(address => uint32) public tokenBalance;
    address public owner;
    uint tokenPrice = 10;
    event Datasent(string _data);
    
    function storeData(uint date, string memory  _temp, string memory _humid) public {
        require(msg.sender == owner, "Not authorized");
        data[date] = sensordata(_temp, _humid);

    }
    
   function multiply(uint x, uint y) internal pure returns(uint z){
          require(y==0 || (z = x*y) / y == x);
     }

    function buyTokens(uint32 _numberOfTokens) public payable{
      require(msg.value == multiply(_numberOfTokens, tokenPrice), "Price either less or more");
      tokenBalance[msg.sender] += _numberOfTokens;
      
    }
        
    function getData(uint _index) public returns(string memory _temp, string memory _humid) {
        require(tokenBalance[msg.sender] > 0, "No tokens in your account");
        tokenBalance[msg.sender] -= 1;
        
        return(data[_index].temp,data[_index].humid );
        
    }
    
    constructor()public {
        owner = msg.sender;
    }
    
    function sweepFunds() public {
        require(msg.sender == owner, "Unauthorized");
        msg.sender.transfer(address(this).balance);
    }

    
}

