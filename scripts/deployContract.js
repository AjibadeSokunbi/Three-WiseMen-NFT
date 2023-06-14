const hre = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const whitelist = require("./whitelist.js");

const BASE_URI = "ipfs://Qmb5A1fFECM2iFHgUioii2khT814nCi6VU9aHXHHqNxHCK/";

async function main() {
  // Calculate merkle root from the whitelist array
  const leafNodes = whitelist.map((addr) => keccak256(addr));
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
  const root = merkleTree.getHexRoot();
  console.log("this is the root", root);
  const proofs = leafNodes.map((leaf) => merkleTree.getHexProof(leaf));
  console.log(proofs);

  // Deploy the contract
  const ThreeWiseMen = await hre.ethers.getContractFactory("ThreeWiseMen");
  const threeWiseMen = await ThreeWiseMen.deploy(BASE_URI, root);

  await threeWiseMen.deployed();

  console.log("ThreeWiseMen deployed to:", threeWiseMen.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

//  this is the root 0x8316a08984627ed85c3ceeeebe775db8a8803c82561f375a2561ea574e528b6b
// [
//   [
//     '0xe765a3166e8f9c384c34527d0cf72e366514abe839d7118a0e7cc80e7c3068c3',
//     '0xe310093c61cf1757ba84a0231fb32ac264868ce58a884f9ce74cce13c2b64998',
//     '0x50ed99a1a561dd7cde67d44e2d0dc0a50bf37dbb1a543e01f34ee8c01127e571'
//   ],
//   [
//     '0x2d457bd78596b9c1c1c323c8e23235aafc777fd8d598f7235e08d4e7af6503a3',
//     '0xe310093c61cf1757ba84a0231fb32ac264868ce58a884f9ce74cce13c2b64998',
//     '0x50ed99a1a561dd7cde67d44e2d0dc0a50bf37dbb1a543e01f34ee8c01127e571'
//   ],
//   [
//     '0xaa35fb45c43bdaccc3031426edc5ad970ccd8a583ee7a26a00ba8224625eee40',
//     '0xc35d98e76374e25d507c7c9e9ba77979e21e80a32cb899806edd83938be25148',
//     '0x50ed99a1a561dd7cde67d44e2d0dc0a50bf37dbb1a543e01f34ee8c01127e571'
//   ],
//   [
//     '0x401ff18359a8044f7933e8d1751605648e7d43a8d20993320a2d3cb79952570f',
//     '0xc35d98e76374e25d507c7c9e9ba77979e21e80a32cb899806edd83938be25148',
//     '0x50ed99a1a561dd7cde67d44e2d0dc0a50bf37dbb1a543e01f34ee8c01127e571'
//   ],
//   [
//     '0x2830acf8eeedfa8484395b0defb4df547b9217f2dddbad6e36be29cd2405a75f',
//     '0x7507efa3b417cc786a471beb8fdb967c03da2a7c2ef461b805f79d7a18d0d040',
//     '0x4d245b50f5b4052c7bf920c8713abb7509485ec309d952105f921299d8f606e9'
//   ],
//   [
//     '0x6bae8e3307a4e79c147f0906760a5445c7dcc14b12641507d6240a3041e0ef31',
//     '0x7507efa3b417cc786a471beb8fdb967c03da2a7c2ef461b805f79d7a18d0d040',
//     '0x4d245b50f5b4052c7bf920c8713abb7509485ec309d952105f921299d8f606e9'
//   ],
//   [
//     '0xab40e39f59ef942781e3c6c1a674c52e5384b1c68c1ba97fab9ef664d3314438',
//     '0x656254d25855720562821dc91f0d4910255c23a0b87b5f6e4704a4472480f23f',
//     '0x4d245b50f5b4052c7bf920c8713abb7509485ec309d952105f921299d8f606e9'
//   ],
//   [
//     '0x167268b363a92baba04e10ae83c6f7ac17cd0d37ae137b40559c0ac330dbe6be',
//     '0x656254d25855720562821dc91f0d4910255c23a0b87b5f6e4704a4472480f23f',
//     '0x4d245b50f5b4052c7bf920c8713abb7509485ec309d952105f921299d8f606e9'
//   ]
// ]
// ThreeWiseMen deployed to: 0x600f9914b2D3b9F3B144F0FcaE8fe4885A7b10b5
