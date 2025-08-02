
## Register flow

1. FRONT send to BACK the user account data

```js
{
    email: "user@example.com",
    authSalt:       CryptoJS.lib.WordArray.random(64),
    encryptionSalt: CryptoJS.lib.WordArray.random(64), 
    authProof:      CryptoJS.PBKDF2(masterPassword, authSalt),
}
```

## Login flow

1. FRONT post email to BACK

```js
{
    email: "user@example.com"
}
```

2. BACK responds with the user's salts

```js
{
    authSalt: string,
    encryptionSalt: string
}
```

3. FRONT uses the `authSalt` to generate and send the `authProof`

```js
{
    email: "user@example.com",
    authProof: CryptoJS.PBKDF2(masterPassword, authSalt)
}
```

4. BACK responds with the encryped data

```js
    if (authProof === storedAuthProof) {
        // ✅ Valid password, send back encrypted vault data
    } else {
        // ❌ Wrong password, send error message
    }
```

5. FRONT uses the `encryptionSalt` to generate the `encryptionKey` (used for encrypt or decrypt)

```js
    const encryptionKey = CryptoJS.PBKDF2(masterPassword, encryptionSalt)
```

6. FRONT uses the `enctyptedKey` to decrypt the `encryptedData`

```js
    const decryptedData = CryptoJS.AES.decrypt(encryptedData, encryptionKey)
```

