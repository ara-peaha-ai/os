---
# All settings are optional unless specified as mandatory

gateways:
  bitcoin: true
  fiat: true
  crypto: true

premium: 8

btcpay:
  storeid: FXpHszyuWAYdP362KaGzwkvtJDP1PdSB6oXGNRYqPp6v
  host: https://learntheropes.xyz

concurrency: serial

availability:
  # Sunday
  - null
  # Monday
  - from: 12
    to:
      hour: 20
      rules:
        - key: timezone
          value: UTC
        - key: note
          value: Typical weekday slot
  # Tuesday
  - from: 12
    to:
      hour: 20
      rules:
        - key: note
          value: Same as Monday
  # Wednesday
  - from: 12
    to:
      hour: 20
      rules:
        - key: priority
          value: high
  # Thursday
  - from: 12
    to:
      hour: 20
      rules:
        - key: buffer
          value: 15m
  # Friday
  - from: 12
    to:
      hour: 18
      rules:
        - key: shortDay
          value: "true"
  # Saturday
  - null

fields:
  name: false

  email:
    show: required
    placeholder: "you@domain.com"
    label: "Email"
    help: "We’ll send confirmations here."
    validation:
      pattern: "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$"
      messages:
        - code: "required"
          text: "Email is required."
        - code: "invalid"
          text: "Please enter a valid email address."

  pgp:
    show: true
    placeholder: "-----BEGIN PGP PUBLIC KEY BLOCK-----"
    label: "PGP key (optional)"
    ui:
      multiline: true
      rows: 6
      hints:
        - key: "tip"
          value: "Paste only your public key."
        - key: "privacy"
          value: "Used to encrypt emails."

  details:
    show: true
    placeholder: "Meeting link, address, or any useful context…"
    label: "Details"
    ui:
      multiline: true
      rows: 4
      suggestions:
        - key: "video"
          value: "Add a meeting link (Zoom/Meet)."
        - key: "inPerson"
          value: "Add the address and access notes."
---
