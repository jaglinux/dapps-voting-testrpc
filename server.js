Web3 = require('web3');
solc = require('solc');
fs = require('fs');

var contractinstance;
var save_json;

console.log("main");
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
console.log(web3.eth.accounts);
code = fs.readFileSync(__dirname+"/voting_1.sol").toString();
console.log(code);
compiledcode = solc.compile(code);
console.log(compiledcode);

abidef = JSON.parse(compiledcode.contracts[':Voting'].interface);
fs.writeFileSync(__dirname+"/abi.txt", compiledcode.contracts[':Voting'].interface);
Bytecode = compiledcode.contracts[':Voting'].bytecode;
votingcontract = web3.eth.contract(abidef);

const deployedcontract = votingcontract.new(['bjp', 'con', 'oth'],
 { data: Bytecode, from: web3.eth.accounts[0], gas: 4700000 },
(err, res) => {
  if(err) {
    console.log(err);
    } else if (res.address){
      console.log(__dirname);
      main_tx = res.transactionHash;
      contractinstance = res.address;
      console.log(contractinstance);
      console.log(main_tx);
      fs.access(__dirname+"/save.txt", (err) => {
        if(err) {
          console.log("error no file");
        } else {
          fs.unlinkSync(__dirname+"/save.txt");
        }
        if(contractinstance)
          save_data(contractinstance);
        if(main_tx)
          save_data(main_tx);
      });
    }
  }
);
//save the data
function save_data(text) {
  fs.appendFileSync(__dirname+"/save.txt", text+'\n');
}
