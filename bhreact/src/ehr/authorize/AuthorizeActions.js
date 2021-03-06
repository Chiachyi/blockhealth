import store from "../../store";
import KernelContract from '../../../build/contracts/KClite.json';
import {message} from 'antd';
var request = require('superagent');

const contract = require('truffle-contract');

export function submitAuth(param) {
    request.post('http://10.0.3.161:8081/solveRequest')
        .send(param)
        .end(function (err, res) {
            if(err){
                alert(err);
            } else {
                if (res.text === 'SUCCESS') {
                    message.info("操作成功");
                }
            }
        });
}

export function getRequestList() {
    let web3 = store.getState().web3.web3Instance;

    if (typeof web3 !== 'undefined') {

        return function(dispatch) {
            const listRequest = contract(KernelContract);
            listRequest.setProvider(web3.currentProvider);
            let listRequestInstance;
            web3.eth.getAccounts(function (error, accounts) {
                if (error) {
                    console.log(error);
                }

                var account = accounts[0];
                listRequest.deployed().then(function (instance) {
                    listRequestInstance = instance;
                    listRequestInstance.getRqstList({from: account})
                        .then(function (result) {
                            return dispatch({
                                type: 'GET_REQUEST_LIST',
                                data: result,
                            })
                        })
                })

            })
        }
    } else {
        console.error('Web3 is not initialized.');
    }
}
