'use strict';

module.exports = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_secret",
				"type": "bytes32"
			},
			{
				"name": "_ownerAddress",
				"type": "address"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_participantAddress",
				"type": "address"
			}
		],
		"name": "getSecret",
		"outputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_secretHash",
				"type": "bytes20"
			},
			{
				"name": "_participantAddress",
				"type": "address"
			},
			{
				"name": "_targetWallet",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			},
			{
				"name": "_token",
				"type": "address"
			}
		],
		"name": "createSwapTarget",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_secret",
				"type": "bytes32"
			},
			{
				"name": "participantAddress",
				"type": "address"
			}
		],
		"name": "withdrawNoMoney",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "swaps",
		"outputs": [
			{
				"name": "token",
				"type": "address"
			},
			{
				"name": "targetWallet",
				"type": "address"
			},
			{
				"name": "secret",
				"type": "bytes32"
			},
			{
				"name": "secretHash",
				"type": "bytes20"
			},
			{
				"name": "createdAt",
				"type": "uint256"
			},
			{
				"name": "balance",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_secretHash",
				"type": "bytes20"
			},
			{
				"name": "_participantAddress",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			},
			{
				"name": "_token",
				"type": "address"
			}
		],
		"name": "createSwap",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_secret",
				"type": "bytes32"
			},
			{
				"name": "_ownerAddress",
				"type": "address"
			},
			{
				"name": "participantAddress",
				"type": "address"
			}
		],
		"name": "withdrawOther",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "tokenOwnerAddress",
				"type": "address"
			}
		],
		"name": "getTargetWallet",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_ownerAddress",
				"type": "address"
			}
		],
		"name": "getBalance",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_participantAddress",
				"type": "address"
			}
		],
		"name": "refund",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "token",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_seller",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_value",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_secretHash",
				"type": "bytes20"
			},
			{
				"indexed": false,
				"name": "createdAt",
				"type": "uint256"
			}
		],
		"name": "CreateSwap",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_seller",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_secretHash",
				"type": "bytes20"
			},
			{
				"indexed": false,
				"name": "withdrawnAt",
				"type": "uint256"
			}
		],
		"name": "Withdraw",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_seller",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_secretHash",
				"type": "bytes20"
			}
		],
		"name": "Refund",
		"type": "event"
	}
]