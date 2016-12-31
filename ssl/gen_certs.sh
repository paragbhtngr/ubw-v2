#!/bin/bash
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365
openssl x509 -outform der -in cert.pem -out cert.crt
