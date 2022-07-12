import React, { useState, useEffect } from "react";
import { Signer } from "casper-js-sdk";

export const SignerConnector = ({ setSignerAccountHash }) => {
  const [isConnected, setConnected] = useState(false);

  useEffect(() => {
    setTimeout(async () => {
      try {
        const connected = await Signer.isConnected();
        setConnected(connected);
      } catch (err) {
        console.log(err);
      }
    }, 100);
  }, []);

  useEffect(() => {
    const asyncFn = async () => {
      try {
        const accountHash = await Signer.getActivePublicKey();
        setSignerAccountHash(accountHash);
      } catch (err) {
        console.log(err);
      }
    };
    if (isConnected) {
      asyncFn();
    }

    window.addEventListener("signer:locked", (msg) => {
      setSignerAccountHash(null);
    });
    window.addEventListener("signer:unlocked", (msg) => {
      if (msg.detail.isConnected) {
        setSignerAccountHash(msg.detail.activeKey);
      }
    });

    window.addEventListener("signer:activeKeyChanged", (msg) => {
      if (msg.detail.isConnected) {
        console.log(msg.detail.activeKey);
        setSignerAccountHash(msg.detail.activeKey);
      }
    });
    window.addEventListener("signer:connected", (msg) => {
      setSignerAccountHash(msg.detail.activeKey);
    });

    window.addEventListener("signer:disconnected", (msg) => {
      setSignerAccountHash(null);
    });
  }, [isConnected]);

  return null;
};

export const SignerScreen = ({ width }) => {
  return (
    <>
      <div className="popup">
        <div className="popup__content popup__content--g20">
          <>
            <button
              className="btn btn--redeem btn--w"
              onClick={Signer.sendConnectionRequest}
            >
              Connect Signer
            </button>
          </>
        </div>
      </div>
    </>
  );
};
