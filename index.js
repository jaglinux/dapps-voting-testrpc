var whole_file;
var contractinstance;
var mainhash;
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
abi = JSON.parse('[{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"totalVotesFor","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"validCandidate","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"votesReceived","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"x","type":"bytes32"}],"name":"bytes32ToString","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"candidateList","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"voteForCandidate","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"contractOwner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"inputs":[{"name":"candidateNames","type":"bytes32[]"}],"payable":false,"type":"constructor"}]')
VotingContract = web3.eth.contract(abi);
// In your nodejs console, execute contractInstance.address to get the address
// at which the contract is deployed and change the line below to use your deployed address
console.log("main");
read_file();
parse_file();

contractInstance = VotingContract.at(contractinstance);
candidates = {"bjp": "candidate-1", "cong": "candidate-2", "others": "candidate-3"}

function voteForParty() {
  console.log("voteforparty");
  candidateName = $("#candidate").val();
  contractInstance.voteForCandidate(candidateName, {from: web3.eth.accounts[0]}, function() {
    console.log("voteforparty inner");
    let div_id = candidates[candidateName];
    $("#" + div_id).html(contractInstance.totalVotesFor.call(candidateName).toString());
  });
}

$(document).ready(function() {
  console.log("ready function");
  candidateNames = Object.keys(candidates);
  for (var i = 0; i < candidateNames.length; i++) {
    let name = candidateNames[i];
    let val = contractInstance.totalVotesFor.call(name).toString()
    $("#" + candidates[name]).html(val);
  }
  $('#' + "addr").html(contractinstance);
});

function read_file() {
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", "./save.txt", false);
  rawFile.onreadystatechange = function ()
  {
      if(rawFile.readyState === 4)
      {
          if(rawFile.status === 200 || rawFile.status == 0)
          {
              whole_file = rawFile.responseText;
              console.log(whole_file);
          }
      }
    }
rawFile.send(null);
}

function parse_file() {
  var input = whole_file;
  var char = '\n';
  var i = j = 0;
  var line;

  while ((j = input.indexOf(char, i)) !== -1) {
    line = input.substring(i, j);
    console.log(line);
    switch(i) {
      case 0:
      contractinstance = line;
        break;
      case 1:
      mainhash = line;
        break;
    }
    i = j + 1;
  }
}
