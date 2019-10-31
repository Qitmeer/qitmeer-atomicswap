/**
 *  test alice
 *  private 23260f6b844cc3cad9b5ef7b93146295fe4b7e4fcfc5973f244a45f3091940a7
 *  wif KxQ312hbN7piLHgQ7G656RGEw97XBAcb4Ss6Xa8kexCLVbPSxqrH
 *  public 037da1e32c2d96f58c8d050be6f8c394c0a04518bcc42d8b292acda0b42d177153
 *  address Tmgjwv1oKCDF7Y9koCmWp234Jwy1n1evNS4
 *  ethaddress 0xB95fB08257DAa1F4d6458a72A95726246f7CCdD1
 * 
 *  test bob
 *  private 30084ea2fc62d93412c6ae1b8567e23783468f1837677cca9060bbcb49b4f3ee
 *  wif Kxq5aKbmDD6JftpuAe6BJRab7MYtSuW8959JXA4JrDijf3muUYQP
 *  public 0260ce88ea226b2f4a2c412d218b7a47060439eb38a9b9ffdaf38e1fe0f94dc34b
 *  address TmeRp1j28asEALtNEbKcDVqZM9AYUeJ3DAn
 *  ethaddress 0xffb409b7b198993cc946ba6d7874676f8FD07188
 * 
 *  secret Key ac4020da2aa7de16da0b5b7d88944c0a8bd3c640d153ecc3692450f6b67bde75
 *  secret Hash 76ca8525763881278982698e025f7bb26b838609
 * 
 */

const ETHSwapsAbi = require('../src/config/ETHSwapABI')
const ERC20SwapsAbi = require('../src/config/ERC20SwapABI')
const tokenAbi = require('../src/config/ERC20')

// const 

const config = {
    private: {
        alice: '23260f6b844cc3cad9b5ef7b93146295fe4b7e4fcfc5973f244a45f3091940a7',
        bob: '30084ea2fc62d93412c6ae1b8567e23783468f1837677cca9060bbcb49b4f3ee'
    },
    secret: {
        key: 'ac4020da2aa7de16da0b5b7d88944c0a8bd3c640d153ecc3692450f6b67bde75',
        Hash: '76ca8525763881278982698e025f7bb26b838609'
    },
    ETHSwaps: {
        abi: ETHSwapsAbi,
        contractAddress: '0x505c53c098A173C9da9aeFee7b7B1a0BF379064e',
        network: 'testnet'
    },
    ERC20Swaps: {
        abi: ERC20SwapsAbi,
        contractAddress: '0x10280cF84828Cd5ca56CF8c757A56E9dc5e288FC',
        tokenAbi: tokenAbi, 
        tokenAddress: '0x01E899e6Bc56aac01760e3aa092129cc0BEEC25F',
        network: 'testnet',
        decimals: 8
    }
}

module.exports = config