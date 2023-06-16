export const genKey = async (user) => {
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
  localStorage.setItem(user.handle, JSON.stringify({ cipher, sign }));
  // localStorage.setItem('private_key',JSON.stringify(cipher_private_exported_key));
  // localStorage.setItem('public_key',JSON.stringify(cipher_public_exported_key));
  console.log(sign_private_exported_key);
};

export const cipher = async (user, pt, encrypt_key_raw) => {
  // console.log('pt: ', pt);

  const keys = JSON.parse(localStorage.getItem(user.handle));
  console.log(keys);
  const enc = new TextEncoder();
  const dec = new TextDecoder();

  encrypt_key_raw = keys.cipher.public;

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

  const sign_pt_raw = await crypto.subtle.sign(
    {
      name: "RSASSA-PKCS1-v1_5",
    },
    sign_key,
    enc.encode(pt)
  );

  const sign_pt = new Uint8Array(sign_pt_raw);
  const message_info = new Uint8Array(pt.length+sign_pt.length+user.handle.length);
  const maxSize = 4096/8 - 2*(256/8) - 2;

  message_info.set(enc.encode(pt),0)
  message_info.set(sign_pt,pt.length)
  message_info.set(enc.encode(user.handle),pt.length + sign_pt.length);


  console.log('aaa',user.handle)
  console.log('aaa',enc.encode(user.handle))

  const sizes = [pt.length,sign_pt.length,user.handle.length];
  // const maxSize = 20;

  let ct = new Uint8Array(512*Math.ceil(message_info.length/maxSize));
  let blockCounter = 0;
  console.log(message_info.length)
  console.log(Math.ceil(message_info.length/maxSize));
  console.log(ct.length)

  for(let i = 0; i < sign_pt.length;i = i + maxSize){
    let next_i = i + maxSize;
    let actualBlock = message_info.slice(i,next_i);
    // console.log(i,i+maxSize)
    console.log(i,actualBlock)
    console.log(i,dec.decode(actualBlock));

    let actual_ct = await crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      encrypt_key,
      actualBlock
    );


    // console.log(blockCounter,new Uint8Array(actual_ct));
    ct.set(new Uint8Array(actual_ct),512*(blockCounter++));

  }

  const hash = await crypto.subtle.digest('SHA-256',enc.encode(pt));

  // console.log(ct);
  
  return {ct,hash: new Uint8Array(hash),sizes};
};

export const decrypt = async (user, ct, sizes, hash, sign_key_raw) => {

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

  sign_key_raw = keys.sign.public;
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


  const maxSize = 4096/8 - 2*(256/8) - 2;
  const dec = new TextDecoder();

  const totalBlocks = ct.length/512;
  const message_info_buffer = new Uint8Array(totalBlocks*maxSize);
  let blockCounter = 0;
  // console.log('is');

  for(let i = 0; i < ct.length;i = i + 512){
    let next_i = i + 512
    let actualBlock = ct.slice(i,next_i);
    // console.log(actualBlock)
    const partial_message_info = await crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      private_key,
      actualBlock
    );

    // console.log(new Uint8Array(partial_message_info));
    // console.log(dec.decode(new Uint8Array(partial_message_info)));
    

    // console.log('bbb',actualBlock);
    message_info_buffer.set(new Uint8Array(partial_message_info),maxSize*(blockCounter++));
  }

  console.log(message_info_buffer);
  
  const pt = message_info_buffer.slice(0,sizes[0]);
  const signed_pt = message_info_buffer.slice(sizes[0], sizes[0] + sizes[1]);
  const isCorrectlySigned = await crypto.subtle.verify("RSASSA-PKCS1-v1_5",sign_key,signed_pt,pt);
  const userHandle = message_info_buffer.slice(sizes[0] + sizes[1],sizes[0] + sizes[1] + sizes[2]);

  const hashed_pt_raw = await crypto.subtle.digest('SHA-256',pt);
  const hashed_pt = new Uint8Array(hashed_pt_raw);

  console.log(hashed_pt);
  console.log(hash);
  const messageIsForUser = hashed_pt.length == hash.length && hashed_pt.reduce((prev,curr,index) => prev && curr == hash[index],1);

  console.log(isCorrectlySigned);
  console.log(dec.decode(pt));
  console.log(dec.decode(userHandle));

  return messageIsForUser && isCorrectlySigned ? {message: dec.decode(pt),handle : dec.decode(userHandle)} : {handle:null,message:null};
};
