const { createAlchemyWeb3 } = require('@alch/alchemy-web3')
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const whitelist = require('../scripts/whitelist.js')
require("dotenv").config();

// const alchemys = process.env.URL
// console.log(alchemys)
const web3 = createAlchemyWeb3("https://eth-mainnet.g.alchemy.com/v2/JOHdJUN4I8RqCltE8B7e5BQBtucmGX0G")
const config = require('../dapp.config')


const address = "0x600f9914b2D3b9F3B144F0FcaE8fe4885A7b10b5"

const contract = require('../artifacts/contracts/ThreeWiseMen.sol/ThreeWiseMen.json')
const nftContract = new web3.eth.Contract(contract.abi, address)

const leafNodes = whitelist.map((addr) => keccak256(addr))
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true })
const root = merkleTree.getRoot()

export const getTotalMinted = async () => {
    const totalMinted = await nftContract.methods.totalSupply().call()
    return totalMinted
  }

  export const getMaxSupply = async () => {
    const maxSupply = await nftContract.methods.MAX_SUPPLY().call()
    return maxSupply
  }
  
  export const isPausedState = async () => {
    const paused = await nftContract.methods.paused().call()
    return paused
  }
  
  export const isPublicSaleState = async () => {
    const publicSale = await nftContract.methods.publicM().call()
    return publicSale
  }
  
  export const isPreSaleState = async () => {
    const preSale = await nftContract.methods.presaleM().call()
    return preSale
  }
  
  export const getPrice = async () => {
    const price = await nftContract.methods._price().call()
    return price
  }

  export const presaleMint = async (mintAmount) => {
    if (!window.ethereum.selectedAddress) {
      return {
        success: false,
        status: 'To be able to mint, you need to connect your wallet'
      }
    }
  
    const leaf = keccak256(window.ethereum.selectedAddress)
    const proof = merkleTree.getHexProof(leaf)
  
    // Verify Merkle Proof
    const isValid = merkleTree.verify(proof, leaf, root)
  
    if (!isValid) {
      return {
        success: false,
        status: 'Invalid Merkle Proof - You are not on the whitelist'
      }
    }
  
    const nonce = await web3.eth.getTransactionCount(
      window.ethereum.selectedAddress,
      'latest'
    )

    const tx = {
        to: address,
        from: window.ethereum.selectedAddress,
        value: parseInt(web3.utils.toWei(String(0.0033 * mintAmount), 'ether')).toString(16), // hex
        data: nftContract.methods
          .presaleMint(window.ethereum.selectedAddress, mintAmount, proof)
          .encodeABI(),
        nonce: nonce.toString(16)
      }
    
      try {
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [tx]
        })
    
        return {
          success: true,
          status: (
            <a href={`https://goerli.etherscan.io/tx/${txHash}`} target="_blank">
              <p>✅Merry Christmas, check out your transaction on Etherscan:</p>
              <p>{`https://goerli.etherscan.io/tx/${txHash}`}</p>
            </a>
          )
        }
      } catch (error) {
        return {
          success: false,
          status: '😞 Smth went wrong:' + error.message
        }
      }
    }
 const publicSalePrice = 0.005
    export const publicMint = async (mintAmount) => {
        if (!window.ethereum.selectedAddress) {
          return {
            success: false,
            status: 'To be able to mint, you need to connect your wallet'
          }
        }
      
        const nonce = await web3.eth.getTransactionCount(
          window.ethereum.selectedAddress,
          'latest'
        )
      
        // Set up our Ethereum transaction
        const tx = {
          to: address,
          from: window.ethereum.selectedAddress,
          value: parseInt(
            web3.utils.toWei(String(publicSalePrice * mintAmount), 'ether')
          ).toString(16), // hex
          data: nftContract.methods.publicSaleMint(mintAmount).encodeABI(),
          nonce: nonce.toString(16)
        }
      
        try {
          const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [tx]
          })
      
          return {
            success: true,
            status: (
              <a href={`https://goerli.etherscan.io/tx/${txHash}`} target="_blank">
                <p>✅Merry Christmas, check out your transaction on Etherscan:</p>
                <p>{`https://goerli.etherscan.io/tx/${txHash}`}</p>
              </a>
            )
          }
        } catch (error) {
          return {
            success: false,
            status: '😞 Smth went wrong:' + error.message
          }
        }
      }

  