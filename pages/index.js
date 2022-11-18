import { Button, Container } from "@chakra-ui/react";
// import { ConnectButton } from "@rainbow-me/rainbowkit";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { client, challenge, authenticate } from "../api";
import Timeline from "../components/Timeline";
import Navbar from "../components/Layout/Navbar";
import LandingPage from "../components/LandingPage";

export default function Home() {
  /* local state variables to hold user's address and access token */
  const [address, setAddress] = useState();
  const [token, setToken] = useState(null);
  useEffect(() => {
    /* when the app loads, check to see if the user has already connected their wallet */
    checkConnection();
    if (typeof window !== "undefined") {
      // Perform localStorage action
      setToken(JSON.parse(localStorage.getItem("accessToken")));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("accessToken", JSON.stringify(token));
  }, [token]);

  async function checkConnection() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    if (accounts.length) {
      setAddress(accounts[0]);
    }
  }
  async function connect() {
    /* this allows the user to connect their wallet */
    const account = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    if (account) {
      setAddress(account[0]);
    }
  }
  async function login() {
    try {
      /* first request the challenge from the API server */
      const challengeInfo = await client.query({
        query: challenge,
        variables: { address },
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      /* ask the user to sign a message with the challenge info returned from the server */
      const signature = await signer.signMessage(
        challengeInfo.data.challenge.text
      );
      /* authenticate the user */
      const authData = await client.mutate({
        mutation: authenticate,
        variables: {
          address,
          signature,
        },
      });
      /* if user authentication is successful, you will receive an accessToken and refreshToken */
      const {
        data: {
          authenticate: { accessToken },
        },
      } = authData;
      console.log({ accessToken });
      setToken(accessToken);
      localStorage.setItem("accessToken", accessToken);
    } catch (err) {
      console.log("Error signing in: ", err);
    }
  }

  return (
    <Container paddingY="10">
      {!address && <button onClick={connect}>Connect</button>}
      {address && !token && (
        <Button onClick={login} marginTop="2">
          {" "}
          Login with Lens
        </Button>
      )}
      {address && token && (
        <>
          <h2>Successfully signed in!</h2>
          {/* <Timeline /> */}
          <LandingPage />
        </>
      )}
    </Container>
  );
}
