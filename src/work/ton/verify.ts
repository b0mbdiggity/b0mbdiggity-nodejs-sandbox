import TonWeb from "tonweb";
import axios from "axios";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import {
  Address,
  beginCell,
  Cell,
  TonClient4,
  loadStateInit,
  contractAddress,
} from "@ton/ton";
import crypto from "crypto";
import BN from "bn.js";
import { randomBytes, sign } from "tweetnacl";
import { tryParsePublicKey } from "./wrappers/wallets-data";
import { sha256 } from "@ton/crypto";

const tonProofPrefix = "ton-proof-item-v2/";
const tonConnectPrefix = "ton-connect";
const allowedDomains = [
  "ton-connect.github.io",
  "localhost:5173",
  "localhost:3000",
];

export async function getWalletPublicKey(address: string): Promise<Buffer> {
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient4({
    endpoint,
  });
  const masterAt = await client.getLastBlock();
  const result = await client.runMethod(
    masterAt.last.seqno,
    Address.parse(address),
    "get_public_key",
    []
  );
  return Buffer.from(
    result.reader.readBigNumber().toString(16).padStart(64, "0"),
    "hex"
  );
}

// export async function genPayload() {
//   const randomBits = crypto.randomBytes(8);

//   const currentTime = Math.floor(Date.now() / 1000);
//   const expirationTime = Buffer.alloc(8);
//   expirationTime.writeBigUint64BE(BigInt(currentTime + 3600)); // a hour
//   const payload = Buffer.concat([randomBits, expirationTime]);

//   const hmac = crypto.createHmac("sha256", "secret key");
//   hmac.update(payload);
//   const signature = hmac.digest();

//   const finalPayload = Buffer.concat([payload, signature]);

//   const payloadHex = finalPayload.subarray(0, 32).toString("hex");

//   console.log(payloadHex);
// }

export async function verify() {
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient4({
    endpoint,
  });

  const payload = {
    address:
      "0:605893d6874139ae5cf8ca022a6b63ad9594ce704dd472d356db1be650ee090a",
    network: "-3",
    public_key:
      "b32332c92071d4f27d2d986ff97b3a601d01e9d0f6669f784c69ceb6018c1ded",
    proof: {
      timestamp: 1730704057,
      domain: {
        lengthBytes: 21,
        value: "ton-connect.github.io",
      },
      signature:
        "Als2EvxZ8EAJD2ELlD40CuOaQu9Q8LDasHujJjSp7725DdF35agrrWQlwToWdKYzz0zYFa8M18LqfnFxZJOcBg==",
      payload:
        "eyJhbGciOiJIUzI1NiJ9.eyJwYXlsb2FkIjoiYmMwODEwODI2YmIzMmYyMmMyMGQ5OTYzNGFhM2ViMWM1ZDg2OGMzM2ZmODJmMWY3ZWMzMDE1N2I5MDA4NDdlMyIsImlhdCI6MTczMDcwNDA0MiwiZXhwIjoxNzMwNzA0OTQyfQ.LujjRO9zHu8xCnqLZLKhZ_pR8PG6129dL1MehtyL13A",
      state_init:
        "te6ccsECFgEAArEAAAUAEgAXABwAjgCTAJgAnQCsALsAwADOANkA6ADsAP4BdAH0AkECfAKGArECATQBFQEU/wD0pBP0vPLICwICASADDgIBSAQFAtzQINdJwSCRW49jINcLHyCCEGV4dG69IYIQc2ludL2wkl8D4IIQZXh0brqOtIAg1yEB0HTXIfpAMPpE+Cj6RDBYvZFb4O1E0IEBQdch9AWDB/QOb6ExkTDhgEDXIXB/2zzgMSDXSYECgLmRMOBw4hEQAgEgBg0CASAHCgIBbggJABmtznaiaEAg65Drhf/AABmvHfaiaEAQ65DrhY/AAgFICwwAF7Ml+1E0HHXIdcLH4AARsmL7UTQ1woAgABm+Xw9qJoQICg65D6AsAQLyDwEeINcLH4IQc2lnbrry4Ip/EAHmjvDtou37IYMI1yICgwjXIyCAINch0x/TH9Mf7UTQ0gDTHyDTH9P/1woACvkBQMz5EJoolF8K2zHh8sCH3wKzUAew8tCEUSW68uCFUDa68uCG+CO78tCIIpL4AN4BpH/IygDLHwHPFsntVCCS+A/ecNs82BED9u2i7fsC9AQhbpJsIY5MAiHXOTBwlCHHALOOLQHXKCB2HkNsINdJwAjy4JMg10rAAvLgkyDXHQbHEsIAUjCw8tCJ10zXOTABpOhsEoQHu/Lgk9dKwADy4JPtVeLSAAHAAJFb4OvXLAgUIJFwlgHXLAgcEuJSELHjDyDXShITFACWAfpAAfpE+Cj6RDBYuvLgke1E0IEBQdcY9AUEnX/IygBABIMH9FPy4IuOFAODB/Rb8uCMItcKACFuAbOw8tCQ4shQA88WEvQAye1UAHIw1ywIJI4tIfLgktIA7UTQ0gBRE7ry0I9UUDCRMZwBgQFA1yHXCgDy4I7iyMoAWM8Wye1Uk/LAjeIAEJNb2zHh10zQAFGAAAAAP///iNmRmWSQOOp5PpbMN/y9nTAOgPToezNPvCY051sAxg72oEU1tz4=",
    },
  };

  const getWalletPubKey = (address) => getWalletPublicKey(address);

  try {
    const stateInit = loadStateInit(
      Cell.fromBase64(payload.proof.state_init).beginParse()
    );

    // 1. First, try to obtain public key via get_public_key get-method on smart contract deployed at Address.
    // 2. If the smart contract is not deployed yet, or the get-method is missing, you need:
    //  2.1. Parse TonAddressItemReply.walletStateInit and get public key from stateInit. You can compare the walletStateInit.code
    //  with the code of standard wallets contracts and parse the data according to the found wallet version.
    let publicKey =
      tryParsePublicKey(stateInit) ?? (await getWalletPubKey(payload.address));
    if (!publicKey) {
      return false;
    }

    // 2.2. Check that TonAddressItemReply.publicKey equals to obtained public key
    const wantedPublicKey = Buffer.from(payload.public_key, "hex");
    if (!publicKey.equals(wantedPublicKey)) {
      return false;
    }

    // 2.3. Check that TonAddressItemReply.walletStateInit.hash() equals to TonAddressItemReply.address. .hash() means BoC hash.
    const wantedAddress = Address.parse(payload.address);
    const address = contractAddress(wantedAddress.workChain, stateInit);
    if (!address.equals(wantedAddress)) {
      return false;
    }

    if (!allowedDomains.includes(payload.proof.domain.value)) {
      return false;
    }

    const now = Math.floor(Date.now() / 1000);
    if (now - 36000 > payload.proof.timestamp) {
      return false;
    }

    const message = {
      workchain: address.workChain,
      address: address.hash,
      domain: {
        lengthBytes: payload.proof.domain.lengthBytes,
        value: payload.proof.domain.value,
      },
      signature: Buffer.from(payload.proof.signature, "base64"),
      payload: payload.proof.payload,
      stateInit: payload.proof.state_init,
      timestamp: payload.proof.timestamp,
    };

    const wc = Buffer.alloc(4);
    wc.writeUInt32BE(message.workchain, 0);

    const ts = Buffer.alloc(8);
    ts.writeBigUInt64LE(BigInt(message.timestamp), 0);

    const dl = Buffer.alloc(4);
    dl.writeUInt32LE(message.domain.lengthBytes, 0);

    // message = utf8_encode("ton-proof-item-v2/") ++
    //           Address ++
    //           AppDomain ++
    //           Timestamp ++
    //           Payload
    const msg = Buffer.concat([
      Buffer.from(tonProofPrefix),
      wc,
      message.address,
      dl,
      Buffer.from(message.domain.value),
      ts,
      Buffer.from(message.payload),
    ]);

    const msgHash = Buffer.from(await sha256(msg));

    // signature = Ed25519Sign(privkey, sha256(0xffff ++ utf8_encode("ton-connect") ++ sha256(message)))
    const fullMsg = Buffer.concat([
      Buffer.from([0xff, 0xff]),
      Buffer.from(tonConnectPrefix),
      msgHash,
    ]);

    const result = Buffer.from(await sha256(fullMsg));

    const isVerified = sign.detached.verify(
      result,
      message.signature,
      publicKey
    );
    console.log("isVerified >>>", isVerified);
    return isVerified;
  } catch (e) {
    console.error(e);
  }
}
