# NyzoSpace

Hierarchical Deterministic wallet for Nyzo Crypto currency.

JS Port.


## Overview

- Generate any amount of keys from a single BIP39 mnemonic  
- Convert any seed into a BIP39 mnemonic (paperCode) and back.
- Usual operations on keys, incl. derivation and several formats.
- conforms to SLIP-0010 
- Relies on audited tweetnacl module for ed25519 crypto.
- Supports Nyzo Strings

Auto build Github pages version: [https://angainordev.github.io/NyzoSpace/js/dist/index.html](https://angainordev.github.io/NyzoSpace/js/dist/index.html) 


## Derivation mechanism

Note: This implementation follows SLIP-0010 [https://github.com/satoshilabs/slips/blob/master/slip-0010.md](https://github.com/satoshilabs/slips/blob/master/slip-0010.md)


BIP 39 mnemonic (12 or more words) => seed (512 bits, 64 bytes)

master seed = sha512Hmac('ed25519 seed').digest(seed)

master seed (64 bytes) => left = seed, right = chainCode

derived_seed = sha512Hmac(parent.chainCode).digest(0 + parent.seed + UINT32(index))

derived_seed (64 bytes) => left = seed, right = chainCode

seed (32 bytes) => privatekey (64 bytes)

privatekey (64 bytes) => publickey (32 bytes)



## Paper codes

entropy (32 bytes) <=> BIP 39 mnemonic (24 words)

entropy (32 bytes) <=> seed (32 bytes)


## Tests 

See test directory for API and sample use.

Validated against from SLIP-0010 test vectors 

[https://github.com/satoshilabs/slips/blob/master/slip-0010.md](https://github.com/satoshilabs/slips/blob/master/slip-0010.md)

## Changelog

- v1 - Paper wallet templates can be selected
- v0.8 - 0.9: Add paper wallet generation
- v0.6: Uses NyzoStrings module to produce also seed and public id in the required format.
- v0.5: Matches SLIP-0010 test vectors
- v0.4: Doc and GUI work
- v0.3: Derivation
- v0.2: Move to tweetnacl
- V0.1: Init tests

## Donation address

Donations will help us maintain and improve this tool and other ones

Nyzo public id:  
id__87vo1ihVrKMFD4bSXHU2D4ZRQKzsZpqCAkP8_PML9Ljzru.zFwbi  
![](https://github.com/AngainorDev/NyzoSpace/raw/master/angainor-pub-ns.png)

77970524776adbe8-9842f4e6ad82984e-f3cad89bed86658d-4c48ff1bee26e4e2  
![](https://github.com/AngainorDev/NyzoSpace/raw/master/angainor-pub.png)
