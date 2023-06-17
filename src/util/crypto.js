export const maxSize = () =>  4096/8 - 2*(256/8) - 2 ;

export const hexToBytes = (hex) => {
  let bytes = [];

  for (var c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }

  return new Uint8Array(bytes);
};

export const genKey = async () => {
  const cipherKeyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );

  const signKeyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["sign", "verify"]
  );

  const cipher_private_exported_key = await window.crypto.subtle.exportKey(
    "jwk",
    cipherKeyPair.privateKey
  );
  const cipher_public_exported_key = await window.crypto.subtle.exportKey(
    "jwk",
    cipherKeyPair.publicKey
  );

  const sign_private_exported_key = await window.crypto.subtle.exportKey(
    "jwk",
    signKeyPair.privateKey
  );
  const sign_public_exported_key = await window.crypto.subtle.exportKey(
    "jwk",
    signKeyPair.publicKey
  );

  const cipher = {
    public: cipher_public_exported_key,
    private: cipher_private_exported_key,
  };
  const sign = {
    public: sign_public_exported_key,
    private: sign_private_exported_key,
  };
  // localStorage.setItem('private_key',JSON.stringify(cipher_private_exported_key));
  // localStorage.setItem('public_key',JSON.stringify(cipher_public_exported_key));
  // console.log(sign_private_exported_key);

  return { cipher, sign };
};

export const cipher = async (user, pt, encrypt_key_raw) => {
  // console.log('pt: ', pt);

  const keys = JSON.parse(localStorage.getItem(user.handle));
  console.log(keys);
  const enc = new TextEncoder();
  const dec = new TextDecoder();

  // encrypt_key_raw = keys.cipher.public;

  const encrypt_key = await crypto.subtle.importKey(
    "jwk",
    encrypt_key_raw,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    false,
    ["encrypt"]
  );

  const sign_key_raw = keys.sign.private;
  console.log(keys.sign.private);
  const sign_key = await crypto.subtle.importKey(
    "jwk",
    sign_key_raw,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    false,
    ["sign"]
  );

  const private_key_raw = keys.cipher.private;
  const private_key = await crypto.subtle.importKey(
    "jwk",
    private_key_raw,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    false,
    ["decrypt"]
  );

  const final_ct = new Uint8Array(512*2);
  
  const pt_ct_raw = await crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    encrypt_key,
    enc.encode(pt)
 );
  const pt_ct = new Uint8Array(pt_ct_raw);

  const handle_ct_raw = await crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    encrypt_key,
    enc.encode(user.handle)
 )
  const handle_ct = new Uint8Array(handle_ct_raw);


  final_ct.set(pt_ct,0);
  final_ct.set(handle_ct,512);

  const hash_raw = await crypto.subtle.digest('SHA-256',enc.encode(pt));
  const hash = new Uint8Array(hash_raw);

  const signedHashRaw = await crypto.subtle.sign(
    {
      name: "RSASSA-PKCS1-v1_5",
    },
    sign_key,
    hash
  );

  const signedHash = new Uint8Array(signedHashRaw);
  
  return {ct: final_ct, hash, signedHash};
};

//  ct = [{user.handle}pk]pk||[{pt}pk]pk

//user.handle
//pt
export const verifyFirm = async (message, signed_hash, sign_key_raw)=>{

  const keys = JSON.parse(localStorage.getItem('1'));
  // sign_key_raw = keys.sign.public;

  const sign_key = await crypto.subtle.importKey(
    "jwk",
    sign_key_raw,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    false,
    ["verify"]
  );

  const enc = new TextEncoder();

  const hashed_pt_raw = await crypto.subtle.digest("SHA-256", enc.encode(message));
  const hashed_pt = new Uint8Array(hashed_pt_raw);

  const isCorrectlySigned = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    sign_key,
    signed_hash,
    hashed_pt
  );


  return isCorrectlySigned;


}

export const decrypt = async (user, ct, hash) => {
  const keys = JSON.parse(localStorage.getItem(user.handle));

  const private_key_raw = keys.cipher.private;
  const private_key = await crypto.subtle.importKey(
    "jwk",
    private_key_raw,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    false,
    ["decrypt"]
  );

  // sign_key_raw = keys.sign.public;

  const dec = new TextDecoder();
  const pt_raw = await crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    private_key,
    ct.slice(0,512)
  );

  const pt = new Uint8Array(pt_raw);

  const userHandle_raw = await crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    private_key,
    ct.slice(512)
  );
  const userHandle = new Uint8Array(userHandle_raw);

  const hashed_pt_raw = await crypto.subtle.digest("SHA-256", pt);
  const hashed_pt = new Uint8Array(hashed_pt_raw);

  
  const messageIsForUser =
    hashed_pt.length == hash.length &&
    hashed_pt.reduce((prev, curr, index) => prev && curr == hash[index], 1);

  console.log(dec.decode(pt),pt.length);
  console.log(dec.decode(userHandle),userHandle.length);

  return messageIsForUser 
    ? { pt: dec.decode(pt), handle: dec.decode(userHandle) }
    : null;
};
