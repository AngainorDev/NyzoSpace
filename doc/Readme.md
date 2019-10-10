# NyzoSpace

Hierarchical Deterministic wallet for Nyzo Crypto currency.

JS Port.

> Temp. Release, not fully compliant yet. 

You can use it, but the results won't be reproducible with final version. 

## Overview

- Generate any amount of keys from a single BIP39 mnemonic  
- Convert any seed into a BIP39 mnemonic (paperCode) and back.
- Usual operations on keys, incl. derivation and several formats.


## Derivation mechanism

BIP 39 mnemonic (12 or more words) => master seed (512 bits, 64 bytes)

master seed (64 bytes) => left = seed, right = chainCode

derived_seed = sha512Hmac(parent.chainCode).digest(0 + parent.seed + UINT32(index))

derived_seed (64 bytes) => left = seed, right = chainCode

seed (32 bytes) => privatekey (64 bytes)

privatekey (64 bytes) => publickey (32  bytes)


Note: The final implementation Will try to follow SLIP-0010 https://github.com/satoshilabs/slips/blob/master/slip-0010.md

TODO:  
- Correct master key generation, from HMAC also
- Force use of hardened keys (no meaning with ed25519, but to be compliant)
- No default password for BIP39?

## Paper codes

entropy (32 bytes) <=> BIP 39 mnemonic (24 words)

entropy (32 bytes) <=> seed (32 bytes)


## Tests 

See test directory for API and sample use.

TODO: Add test vectors from SLIP-0010 

## Changelog

- v0.4: Doc and GUI work
- v0.3: Derivation
- v0.2: Move to tweetnacl
- V0.1: Init tests

