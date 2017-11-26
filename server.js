Web3 = require('web3');
solc = require('solc');
fs = require('fs');

var contractinstance;
var save_json;

web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
//console.log(web3.eth.accounts);
code = fs.readFileSync('/home/jag/voting/voting.sol').toString();
//console.log(code);
compiledcode = solc.compile(code);
//console.log(compiledcode);

abidef = JSON.parse(compiledcode.contracts[':Voting'].interface);
Bytecode = compiledcode.contracts[':Voting'].bytecode;
votingcontract = web3.eth.contract(abidef);

const deployedcontract = votingcontract.new(['bjp', 'cong', 'others'],
 { data: Bytecode, from: web3.eth.accounts[0], gas: 4700000 },
(err, res) => {
  if(err) {
    console.log(err);
  } else {
      console.log(__dirname);
      main_tx = res.transactionBbHash;
      contractinstance = res.address;
      console.log(main_tx);
      console.log(contractinstance);
      if(contractinstance)
        save_data();
    }
}
);
//save the data
function save_data() {
  fs.writeFile(__dirname+"/save.txt", contractinstance, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});
}
