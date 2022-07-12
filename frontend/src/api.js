import { API_URL } from "./constants";

export const fetchAllNFTs = () => fetch(API_URL).then(resp => resp.json());

export const fetchStatus = (accountHash) =>
  fetch(`${API_URL}/status/account-hash-${accountHash}`).then((resp) =>
    resp.json()
  );

export const submitTicket = (email, code, accountHash) =>
  fetch(API_URL, {
    method: "PATCH",
    body: JSON.stringify({
      email,
      code,
      accountHash: `account-hash-${accountHash}`,
    }),
    headers: { "Content-Type": "application/json" },
  })
    .then((resp) => resp.json())
