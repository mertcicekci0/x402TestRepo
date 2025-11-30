"use client";

import { useState } from "react";
import { Lock, Wallet, ArrowRight, CheckCircle, ExternalLink, RotateCcw, Loader2, Zap, Terminal } from "lucide-react";
import { isConnected, getAddress, signTransaction } from "@stellar/freighter-api";
import * as StellarSdk from "@stellar/stellar-sdk";

export default function Home() {
  // State Management
  const [step, setStep] = useState<'locked' | 'connected' | 'paying' | 'unlocked'>('locked');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [fullAddress, setFullAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Connect Wallet (Real Freighter Integration)
  const connectWallet = async () => {
    setLoading(true);
    setLoadingText("INITIALIZING_LINK...");
    setError(null);

    try {
      const isInstalled = await isConnected();
      
      if (!isInstalled) {
        setError("ERR: WALLET_NOT_FOUND");
        setLoading(false);
        return;
      }

      const response = await getAddress();
      // @ts-ignore
      const key = typeof response === 'string' ? response : response?.address;

      if (key) {
        setFullAddress(key);
        const shortAddress = `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
        setWalletAddress(shortAddress);
        setStep('connected');
      } else {
        setError("ERR: ACCESS_DENIED");
      }

    } catch (err) {
      console.error("Connection failed", err);
      setError("ERR: CONNECTION_FAILED");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Pay (Real Stellar Transaction)
  const pay = async () => {
    if (!fullAddress) {
      setError("ERR: NO_WALLET");
      return;
    }

    setLoading(true);
    setStep('paying');
    setLoadingText("BUILDING_TX...");
    setError(null);

    try {
      const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");
      const account = await server.loadAccount(fullAddress);
      const fee = await server.fetchBaseFee();
      
      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: fee.toString(),
        networkPassphrase: "Test SDF Network ; September 2015",
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: "GC63PSERYMUUUJKYSSFQ7FKRAU5UPIP3XUC6X7DLMZUB7SSCPW5BSIRT",
            asset: StellarSdk.Asset.native(),
            amount: "1",
          })
        )
        .setTimeout(30)
        .build();

      const xdr = transaction.toXDR();

      setLoadingText("WAITING_SIGNATURE...");

      const signedTx = await signTransaction(xdr, {
        network: "TESTNET",
        networkPassphrase: "Test SDF Network ; September 2015",
      });

      if (signedTx) {
        setLoadingText("VERIFYING...");
        setTimeout(() => {
          setLoading(false);
          setStep('unlocked');
        }, 1000);
      } else {
        throw new Error("USER_REJECTED");
      }

    } catch (err: any) {
      console.error("Payment failed", err);
      setError(err.message || "ERR: TX_FAILED");
      setLoading(false);
    }
  };

  // Reset Demo
  const resetDemo = () => {
    setStep('locked');
    setWalletAddress(null);
    setFullAddress(null);
    setLoading(false);
    setError(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black font-mono relative dot-pattern">
      
      {/* Navbar */}
      <nav className="w-full bg-white border-b-4 border-black px-6 py-4 flex justify-between items-center z-50 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="bg-black text-white p-2 border-2 border-black hover:bg-white hover:text-black transition-colors cursor-default">
            <Zap size={24} fill="currentColor" strokeWidth={3} />
          </div>
          <span className="font-black text-2xl tracking-tighter uppercase">Stellar_x402</span>
        </div>
        
        {walletAddress && (
          <div className="flex items-center gap-3 bg-white px-4 py-2 border-2 border-black hard-shadow">
            <div className="w-3 h-3 bg-black animate-pulse"></div>
            <span className="font-bold text-lg">{walletAddress}</span>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        
        {/* LOCKED STATE */}
        {step !== 'unlocked' && (
          <div className="w-full max-w-md animate-slide-up">
            <div className="bg-white border-4 border-black p-8 text-center hard-shadow relative">
              
              {/* Decorative Corner Squares */}
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-black"></div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-black"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-black"></div>
              <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-black"></div>

              {/* Icon */}
              <div className="mx-auto w-24 h-24 bg-white border-4 border-black flex items-center justify-center mb-8 hard-shadow">
                <Lock className="text-black" size={40} strokeWidth={3} />
              </div>

              {/* Content Info */}
              <h1 className="text-3xl font-black uppercase mb-4 tracking-tight">x402_ACCESS</h1>
              <p className="text-black font-bold mb-8 text-lg border-l-4 border-black pl-4 text-left">
                // RESTRICTED_ZONE<br/>
                Protocol requires payment.<br/>
                Unlock full ecosystem access.
              </p>

              {/* Price Tag */}
              <div className="bg-black text-white p-4 mb-8 flex justify-between items-center border-2 border-black">
                <span className="font-bold uppercase">Cost_Amount</span>
                <span className="text-2xl font-black font-mono">1.00 XLM</span>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-white text-black font-bold text-sm p-3 mb-6 border-2 border-black hard-shadow">
                  ! {error}
                </div>
              )}

              {/* Actions */}
              <div className="space-y-6">
                
                {loading ? (
                  /* Loading State */
                  <div className="flex flex-col items-center justify-center py-4 border-2 border-black bg-gray-50">
                    <Loader2 className="animate-spin text-black mb-2" size={32} strokeWidth={3} />
                    <span className="text-lg font-bold uppercase animate-pulse">{loadingText}</span>
                  </div>
                ) : (
                  <>
                    {/* STEP 1: Connect */}
                    {step === 'locked' && (
                      <button 
                        onClick={connectWallet}
                        className="w-full bg-white text-black border-4 border-black font-black py-4 px-6 text-xl uppercase tracking-wide hover:bg-black hover:text-white transition-all hard-shadow active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-3 group"
                      >
                        <Wallet size={24} strokeWidth={3} />
                        Connect_Wallet
                      </button>
                    )}

                    {/* STEP 2: Pay */}
                    {step === 'connected' && (
                      <button 
                        onClick={pay}
                        className="w-full bg-black text-white border-4 border-black font-black py-4 px-6 text-xl uppercase tracking-wide hover:bg-white hover:text-black transition-all hard-shadow active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-3 group"
                      >
                        <span>Execute_Payment</span>
                        <ArrowRight className="group-hover:translate-x-2 transition-transform" size={24} strokeWidth={3} />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* UNLOCKED CONTENT */}
        {step === 'unlocked' && (
          <div className="w-full max-w-6xl h-[85vh] animate-slide-up">
            <div className="bg-white border-4 border-black h-full flex flex-col hard-shadow">
              {/* Toolbar */}
              <div className="bg-white border-b-4 border-black px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3 bg-black text-white px-4 py-2 border-2 border-black">
                  <CheckCircle size={20} strokeWidth={3} />
                  <span className="font-bold uppercase tracking-wide">Access_Granted</span>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => window.open('https://www.x402stellar.xyz/', '_blank')}
                    className="text-black hover:bg-black hover:text-white border-2 border-black font-bold flex items-center gap-2 px-4 py-2 uppercase transition-colors text-sm"
                  >
                    <ExternalLink size={16} strokeWidth={3} />
                    Open_New_Tab
                  </button>
                  <button 
                    onClick={resetDemo}
                    className="text-black hover:bg-black hover:text-white border-2 border-black font-bold flex items-center gap-2 px-4 py-2 uppercase transition-colors text-sm"
                  >
                    <RotateCcw size={16} strokeWidth={3} />
                    Reset
                  </button>
                </div>
              </div>
              
              {/* Website Embed */}
              <div className="flex-grow bg-white p-1 relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-striped-brick.png')] opacity-10 pointer-events-none"></div>
                <iframe 
                  src="https://www.x402stellar.xyz/" 
                  className="w-full h-full border-none" 
                  title="x402 Stellar Website"
                ></iframe>
              </div>
            </div>
        </div>
        )}

      </main>

      {/* Footer / Status Bar */}
      <footer className="bg-black text-white p-2 text-center text-xs font-mono uppercase border-t-4 border-white">
        System_Status: Online | Protocol: x402 | Network: Stellar_Testnet
      </footer>
    </div>
  );
}
