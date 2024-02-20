<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<br />

<h3 align="center">x-forwarded-for-blocker</h3>

  <p align="center">
    using Cloudflare Workers to create a rule based on a ENV variable
    the example code blocks every traffic contains IPs from IPTOBLOCK environment variable
	modify the code to fit your needs
    <br />

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

1. create token from Cloudflare account with following access
   Zone WAF : edit
   Firewall Service : edit

2. find your Zone ID from dashboard

### Installation

1. login to your Cloudflare profile
   (the account must have an edit access from the zone you are modifying)

2. Clone the repo
   ```sh
   git clone https://github.com/cf-jongsik/x-forwarded-blocker.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. login
   ```sh
   npm exec wrangler login
   ```
5. modify variable in wrangler.toml  (csv style) 
   ```sh
   [vars]
   IPTOBLOCK = x.x.x.x,y.y.y.y
   ```
7. deploy
   ```sh
   npm exec wrangler deploy
   ```
8. add secret variable (API TOKEN + ZONE ID)
   ```sh
   npm exec wrangler secret put CLOUDFLARE_API_TOKEN
   ```
   ```sh
   npm exec wrangler secret put ZONEID
   ```
   <p align="right">(<a href="#readme-top">back to top</a>)</p>
