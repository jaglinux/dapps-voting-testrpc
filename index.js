var whole_file;
var contractinstance;
var main_hash, tx_hash;
var vote_number=0;
var account_id=0;
console.log("main");
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
read_abi_file();
/*
abi = JSON.parse('[{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"totalVotesFor","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"validCandidate","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"votesReceived","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"x","type":"bytes32"}],"name":"bytes32ToString","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"candidateList","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"voteForCandidate","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"contractOwner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"inputs":[{"name":"candidateNames","type":"bytes32[]"}],"payable":false,"type":"constructor"}]')
*/
abi = JSON.parse(abi_file);
VotingContract = web3.eth.contract(abi);

read_file();
parse_file();

contractInstance = VotingContract.at(contractinstance);
candidates = {"bjp": "candidate-1", "cong": "candidate-2", "others": "candidate-3"}

function voteForParty() {
  if(account_id == 3)
	account_id = 0;
  console.log("voteforparty from account %d", account_id);
  candidateName = $("#candidate").val();

    tx_hash = contractInstance.vote(candidateName, {from: web3.eth.accounts[account_id++]});
    if(tx_hash) {
      console.log("voteforparty inner");
      let div_id = candidates[candidateName];
      $("#" + div_id).html(contractInstance.count.call(candidateName).toString());
      add_hash();
    }
}

$(document).ready(function() {
  console.log("ready function");
  candidateNames = Object.keys(candidates);
  for (var i = 0; i < candidateNames.length; i++) {
    let name = candidateNames[i];
    let val = contractInstance.count.call(name).toString()
    $("#" + candidates[name]).html(val);
  }
  $('#' + "main_addr").html(contractinstance);
  $('#' + 'main_hash').html(main_hash);
});

function read_abi_file() {
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", "./abi.txt", false);
  rawFile.onreadystatechange = function ()
  {
      if(rawFile.readyState === 4)
      {
          if(rawFile.status === 200 || rawFile.status == 0)
          {
              abi_file = rawFile.responseText;
              //console.log(abi_file);
          }
      }
    }
rawFile.send(null);
}
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
  var i = j = k = 0;
  var line;

  while ((j = input.indexOf(char, i)) !== -1) {
    line = input.substring(i, j);
    switch(k) {
      case 0:
      contractinstance = line;
        break;
      case 1:
      main_hash = line;
        break;
    }
    i = j + 1;
    k++;
  }
}

function add_hash() {
    var table = document.getElementById("my_table");
    var row = table.insertRow(vote_number);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = "vote: "+vote_number+" Hash";
    cell2.innerHTML = tx_hash;
    vote_number++;
}
