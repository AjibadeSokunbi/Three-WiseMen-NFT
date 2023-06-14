import { useState, useEffect } from "react";
import { ConnectButton } from "web3uikit";
import { useMoralis } from "react-moralis";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { config } from "../dapp.config";
import {
  getTotalMinted,
  getMaxSupply,
  isPausedState,
  isPublicSaleState,
  isPreSaleState,
  presaleMint,
  publicMint,
} from "../utils/interact";
import MyTimer from "../component/MyTimer";


const Mint = () => {
  const { account } = useMoralis();
  const [maxSupply, setMaxSupply] = useState(0);
  const [totalMinted, setTotalMinted] = useState(0);
  const [maxMintAmount, setMaxMintAmount] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isPublicSale, setIsPublicSale] = useState(false);
  const [isPreSale, setIsPreSale] = useState(false);
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState(null);
  const [mintAmount, setMintAmount] = useState(1);
  const [isMinting, setIsMinting] = useState(false);
  const [active , setActive] = useState(3600)

  const time = new Date("Mar 16, 2023 15:00:00");
  time.setSeconds(time.getSeconds() + active);

  useEffect(() => {
    const init = async () => {
      setMaxSupply(await getMaxSupply());
      setTotalMinted(await getTotalMinted());

      setPaused(await isPausedState());
      setIsPublicSale(await isPublicSaleState());
      const isPreSale = await isPreSaleState();
      setIsPreSale(isPreSale);
 
      setMaxMintAmount(
        isPreSale ? config.presaleMaxMintAmount : config.maxMintAmount
      );

      setPrice(isPreSale ? config.preSalePrice : config.publicSalePrice);
    };

    init();
  }, []);

  const incrementMintAmount = () => {
    if (mintAmount < maxMintAmount) {
      setMintAmount(mintAmount + 1);
    }
  };

  const decrementMintAmount = () => {
    if (mintAmount > 1) {
      setMintAmount(mintAmount - 1);
    }
  };

  const presaleMintHandler = async () => {
    setIsMinting(true);

    const { success, status } = await presaleMint(mintAmount);

    setStatus({
      success,
      message: status,
    });

    setIsMinting(false);
  };

  const publicMintHandler = async () => {
    setIsMinting(true);

    const { success, status } = await publicMint(mintAmount);

    setStatus({
      success,
      message: status,
    });

    setIsMinting(false);
  };

  return (
    <div>
      <div className="min-h-screen h-full w-full overflow-hidden flex flex-col items-center justify-center bg-brand-background ">
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          <img
            src="/images/IMG2.jpg"
            className="animate-pulse-slow absolute inset-auto block w-full min-h-screen object-cover"
          />

          <div className="pillwill flex flex-col items-center justify-center h-full w-full px-2 md:px-10">
            <div className="relative z-1 md:max-w-3xl w-full bg-gray-900/90 filter backdrop-blur-sm py-4 rounded-md px-2 md:px-10 flex flex-col items-center">
              <h1 className="font-coiny uppercase font-bold text-3xl md:text-4xl bg-gradient-to-br  from-brand-blue to-brand-blue bg-clip-text text-transparent mt-3">
                {paused
                  ? "Paused"
                  : isPreSale
                  ? "whitelist Mint"
                  : "Public Mint"}
               
              </h1>
              {account ? (
                <div style={{ display: "flex" }}>
                  <ConnectButton moralisAuth={false} />
                </div>
              ) : (
                <div style={{ display: "none" }}>
                  <ConnectButton moralisAuth={false} />
                </div>
              )}

              <div className="flex flex-col md:flex-row md:space-x-14 w-full mt-10 md:mt-14">
                <div className="flex flex-col items-center w-full px-4 mt-16 md:mt-0">
                  <div className="font-coiny flex items-center justify-between w-full">
                    <button
                      className="w-14 h-10 md:w-16 md:h-12 flex items-center justify-center text-brand-background hover:shadow-lg bg-gray-300 font-bold rounded-md"
                      onClick={incrementMintAmount}
                    >
                      <FaPlus />
                    </button>

                    <p className="flex items-center justify-center flex-1 grow text-center font-bold text-brand-blue text-3xl md:text-4xl">
                      {mintAmount}
                    </p>

                    <button
                      className="w-14 h-10 md:w-16 md:h-12 flex items-center justify-center text-brand-background hover:shadow-lg bg-gray-300 font-bold rounded-md"
                      onClick={decrementMintAmount}
                    >
                      <FaMinus />
                    </button>
                  </div>

                  <p className="text-sm text-pink-200 tracking-widest mt-3">
                    {maxMintAmount} per wallet
                  </p>

                  <div className="border-t border-b py-4 mt-16 w-full">
                    <div className="w-full text-xl font-coiny flex items-center justify-between text-brand-blue">
                      <p>Total</p>

                      <div className="flex items-center space-x-3">
                        <p>
                          {Number.parseFloat(price * mintAmount).toFixed(4)} ETH
                        </p>{" "}
                        <span className="text-gray-400">+ GAS</span>
                      </div>
                    </div>
                  </div>

                  {/* Mint Button && Connect Wallet Button */}
                  {account ? (
                    <button
                      style={{ marginBottom: "20px" }}
                      className={` ${
                        paused || isMinting
                          ? "bg-gray-900 cursor-not-allowed"
                          : "bg-gradient-to-br from-brand-blue to-brand-white shadow-lg hover:shadow-pink-400/50"
                      } font-coiny mt-12 w-full px-6 py-3 rounded-md text-2xl text-white  mx-4 tracking-wide uppercase`}
                      disabled={paused || isMinting}
                      onClick={
                        isPreSale ? presaleMintHandler : publicMintHandler
                      }
                    >
                      {isMinting ? "Minting..." : "Mint"}
                    </button>
                  ) : (
                    <ConnectButton
                      style={{ margin: "20px" }}
                      id="newcss"
                      moralisAuth={false}
                    />
                  )}
                </div>
                <div
                  className="relative w-full"
                  style={{ marginBottom: "10px" }}
                >
                  <div className="font-coiny z-10 absolute top-2 left-2 opacity-80 filter backdrop-blur-lg text-base px-4 py-2 bg-black border border-brand-purple rounded-md flex items-center justify-center text-white font-semibold">
                    <p>
                      <span className="text-brand-blue">{totalMinted}</span> /{" "}
                      {maxSupply}
                    </p>{" "}
                    <br />
                  </div>

                  <img
                    src="/images/IMG4.jpg"
                    className="object-cover w-full sm:h-[480px] md:w-[450px] rounded-md"
                  />

                  {isPreSale ? (
                    <div className="font-coiny z-10 absolute top-2 right-2 opacity-80 filter backdrop-blur-lg text-base px-4 py-2 bg-black border border-brand-purple rounded-md flex items-center justify-center text-white font-semibold">
                      <MyTimer
                        className="text-brand-pink"
                        expiryTimestamp={time}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              {/* Status */}
              {status && (
                <div
                  className={`border ${
                    status.success
                      ? "border-green-500"
                      : "border-brand-pink-400 "
                  } rounded-md text-start h-full px-4 py-4 w-full mx-auto mt-8 md:mt-4"`}
                >
                  <p className="flex flex-col space-y-2 text-white text-sm md:text-base break-words ...">
                    {status.message}
                  </p>
                </div>
              )}

              {/* Contract Address */}
              <div className="border-t border-gray-800 flex flex-col items-center mt-10 py-2 w-full">
                <h3 className="font-coiny text-2xl text-brand-blue uppercase mt-6">
                  Contract Address
                </h3>
                <a
                  href={`https://goerli.etherscan.io/address/${config.contractAddress}#readContract`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 mt-4"
                >
                  <span className="break-all ...">
                    {config.contractAddress}
                  </span>
                </a>
                <a
                  href="https://testnets.opensea.io/collection/threewisemen-v2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 mt-4"
                >
                  <span className="break-all ...">
                    Opensea
                    
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mint;
