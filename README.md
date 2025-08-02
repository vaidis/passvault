# PassVaut

Self hosted, multilayered secured, lightweight password manager for families.

Question 1: How secure is it?

1. Cross-Site Scripting (XSS) Protection by validate and sanitize user input.
2. Cross-Site Scripting (XSS) Protection by helmet library.
3. Cross-Site Request Forgery (CSRF) Protection
4. SQL Injection Protection by not using SQL :) lol
5. Automatically update all libraries daily

Question 2: What is someone get access on server somehow?
1. The server holds the passwords in encrypted form and it doesn't know the key to decrypt them
2. The server asks the Key holder (another host) for the key to decrypt the passwords
2. The Key Holder that runs on a second raspberry pi installed somewhere hidden, holds the keys to decrypt the passwords
3. The Key Holder host is untracable from network scanners

Question 3: What if the backend server stoled from my home?
- The backend raspberry pi canntot decrypt is own database without the second raspberry pi that holds the decrypt key

Question 4: What if someone tries random usernames and passwords?
- He get banned from the firewall


```
[ Fronend ] ------> [ Backend ] -----> [ Key Holder ]
```
