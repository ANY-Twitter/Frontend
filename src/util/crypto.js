export const genKey = async (user) => {
        let keyPair = await window.crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 4096,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256",
            },
            true,
            ["encrypt", "decrypt"]
        );

        const private_exported_key = await window.crypto.subtle.exportKey('jwk',keyPair.privateKey);
        const public_exported_key = await window.crypto.subtle.exportKey('jwk',keyPair.publicKey);

        const keys = {private_exported_key,public_exported_key}
        localStorage.setItem(user.handle,JSON.stringify(keys))
        // localStorage.setItem('private_key',JSON.stringify(private_exported_key));
        // localStorage.setItem('public_key',JSON.stringify(public_exported_key));
        console.log(private_exported_key);

}