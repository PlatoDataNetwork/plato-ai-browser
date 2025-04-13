Cross-Platform Solana Web3 Browser and dApp Environment – System Specification

1. Architecture Overview
The system is a full-stack Web3 application composed of a React-based client (web, desktop, and mobile), a Node.js middleware server, integrated Rust components for Solana blockchain interactions, and a Solana network connection (validator). The architecture follows a multi-tier design where the frontend UI communicates with backend services and the Solana blockchain in a secure, efficient manner. Below is a high-level breakdown of the architecture:
Client Layer (Web & Mobile) – A React web app (which can be wrapped in Electron for desktop) and a React Native mobile app provide the user interface. They handle user interactions, display dApp content (via an in-app browser), and manage an embedded wallet. The web and mobile clients share logic where possible (e.g. using common React components and libraries) to maximize code reuse and ensure a consistent cross-platform experience (Solana dApp Cross-Platform Support - InstantNodes | Next-Generation RPC Solutions for Solana). The UI communicates with the middleware via HTTPS (REST API) and with the Solana network via the embedded wallet or direct RPC calls.


Middleware Layer (Node.js) – An Express.js server acts as a middleware API layer. It aggregates data from the Solana blockchain (and possibly other sources, like a dApp index database) and provides endpoints for the client. This layer can handle tasks such as fetching a list of available dApps, caching blockchain data for performance, and orchestrating complex operations. By using Node.js, we leverage Solana’s JavaScript SDK (solana-web3.js) on the server side for blockchain calls (Solana dApp Cross-Platform Support - InstantNodes | Next-Generation RPC Solutions for Solana), as well as enable real-time features (using WebSockets or Socket.io for event push). The Node.js layer decouples the frontend from direct blockchain access, offering a stable interface and additional security (e.g., input validation, rate limiting) for client requests.


Blockchain Interaction Layer (Rust & Solana) – Low-level blockchain communication and any on-chain programs are handled in Rust. Solana’s runtime and programs are implemented in Rust for performance and safety (Building Solana DApps in 2024: Ultimate Guide), so this layer encompasses any Rust-based modules or services needed:


A Solana Validator Node (Testnet or Devnet) to which the app connects. In a development environment, a local solana-test-validator may be used, which is a Solana blockchain emulator providing a private environment for testing (Local Program Development - Solana). In production, the app would connect to a public Solana testnet or mainnet validator via RPC.


Rust programs (smart contracts) deployed to Solana that power certain dApp functionalities. These could be written using Anchor (the Solana framework) for easier development and then deployed to the network. The high-performance Solana runtime (in Rust) allows the application to support complex on-chain interactions efficiently (Building Solana DApps in 2024: Ultimate Guide).


Optionally, Rust native modules for off-chain use: for example, heavy cryptographic operations or direct RPC handling could be implemented in Rust and invoked from Node.js (via FFI or bridging libraries like Neon) to ensure memory safety and performance. This isn’t strictly required (since web3.js covers most needs), but it’s an architectural option for future optimization.


Integrated Wallet & Secure Key Store – The wallet is a critical part of the architecture, integrated into the client. It manages the user’s Solana keypair (private/public key) and facilitates transaction signing locally. The wallet is present in both the web/Electron app and the React Native app, using secure storage on each platform to protect private keys (browser local storage with encryption, OS keychain on mobile, etc.). The wallet exposes a standard interface (similar to Solana Wallet Adapter) so that dApps can request actions (connect, sign transactions) in a uniform way (Interact With Wallets - Solana). The private key never leaves the client; only signed transactions or public keys are sent to the Node.js or blockchain. This ensures end-to-end security for transactions.


External dApps and Services – The environment includes a dApp browser that allows users to load external decentralized applications (usually web apps) within a sandboxed WebView (on mobile) or an embedded browser (on desktop). These external dApps interact with the integrated wallet through a controlled API (injection of a JavaScript provider). The architecture isolates dApp content from direct access to the wallet’s keys, requiring all signature requests to go through the wallet’s approval flow.
Interaction Flow: When the user performs an action (e.g., initiating a token transfer in a dApp), the request flows from the dApp interface to the wallet (via the injected provider). The wallet signs the transaction (using the Rust/JS cryptography module) and then forwards the signed transaction to either the Node.js middleware or directly to the Solana RPC node. The Node server can relay transactions to the validator and listen for confirmations, sending back status updates to the client via WebSocket for real-time feedback. Meanwhile, the client can also subscribe to blockchain events (using solana-web3.js subscriptions or through the Node service) to update UI elements in real-time (for example, showing an updated token balance once a transfer completes).

Diagram – Layered Architecture:

High-level architecture of the cross-platform Solana dApp browser. The React/Electron frontends and React Native app interact with a Node.js API middleware, which in turn communicates with the Solana blockchain (validator) via JSON RPC or WebSockets. The integrated wallet (client-side) handles keys and signing, while Rust-based Solana programs run on-chain (and optionally assist off-chain).
(In the above diagram, solid arrows represent direct calls or communications: e.g., the client making API calls to Node or RPC calls to Solana, and the Node using RPC to query the validator. Dashed arrows represent permissioned interactions: the dApp content requests wallet access, which the integrated wallet mediates.)

This architecture ensures a separation of concerns: the UI focuses on presentation, the middleware on aggregation and off-chain logic, and the Rust/Solana layer on on-chain logic and high-performance tasks. It also enables cross-platform support, as the core logic is split between portable JavaScript (for Node and React) and platform-specific deployment of the UI. Solana’s design and tooling support this cross-platform approach, allowing developers to target web browsers, mobile devices, and desktops with one codebase where possible (Solana dApp Cross-Platform Support - InstantNodes | Next-Generation RPC Solutions for Solana).

2. Key Components
   
This section details the key components of the system and their roles:
2.1 Frontend Applications (React Web, React Native Mobile, Electron Desktop)
Web App (React): The web frontend is built with React, utilizing modern frameworks and tools for a responsive, fast UI. It may be structured as a single-page application (SPA) for a seamless user experience. Styling is handled with Tailwind CSS (or a similar utility-first CSS framework) for consistent design and efficient, atomic styling. Tailwind ensures a high-performance UI by generating minimal CSS and promoting reuse of styles, which is important for maintaining speed across devices. The web app can be deployed as a Progressive Web App (PWA) to allow installation on desktops or mobile browsers, though in our case we will wrap it with Electron for a native desktop app experience.

Mobile App (React Native): The mobile client is built using React Native, allowing us to share a portion of the codebase with the web app. We use a library like React Navigation for in-app navigation and can apply a Tailwind-like styling approach via libraries (such as NativeWind) to maintain design consistency with the web. The mobile app includes a built-in WebView component for the dApp browser interface. When a user selects a decentralized app from the directory, a WebView loads the dApp’s web content. The React Native code injects a Solana provider script into this WebView (using the WebView’s injection capabilities), which enables the dApp to call window.solana (for example) and trigger wallet requests. The mobile app also handles platform-specific UI/UX concerns: using native components for camera (if QR code scanning for wallet addresses is needed), handling push notifications, and ensuring smooth touch interactions and animations for an immersive feel.

Desktop App (Electron): The desktop application packages the web React app in an Electron container. Electron allows the web code to run in a Chromium engine, with Node.js integration. We leverage this to integrate the wallet deeply: for instance, using Electron’s ipcRenderer and ipcMain to mediate between the dApp content and the wallet module. The desktop app provides a native window frame, system tray integration (for quick access to the wallet or notifications), and can also leverage file system access if needed (for example, to allow the user to export or import wallet keys securely from a file). The Electron app uses the same React code as the web, ensuring consistency. Any differences (like menus or shortcut keys) are handled in Electron’s main process. Packaging is done for Windows, macOS, and Linux. By using Electron, we ensure the desktop app has feature parity with the web version and can even operate offline (with local data caching), while still being auto-updateable.

Responsibilities of the Frontend: Regardless of platform, the frontend is responsible for user onboarding (UI flows for creating or importing a wallet), displaying the list of dApps, rendering the dApp browser view, and providing wallet UI components (showing balances, recent transactions, and requesting user approval for transactions). It also maintains a real-time connection to the backend (e.g., via WebSocket or long polling) to receive updates like new dApps or blockchain events. The frontend must be optimized for performance and responsiveness – using techniques like lazy loading of dApp content, memoization in React to avoid re-rendering, and perhaps leveraging background threads (Web Workers or React Native’s InteractionManager) for any heavy computations.

2.2 Node.js Middleware (API Server & Aggregator)
The Node.js middleware is an Express.js application serving as the backend for off-chain data and as a proxy for certain on-chain interactions. Its key functions include:
REST/GraphQL API: The server exposes endpoints (or GraphQL resolvers) for various data needs of the client. For example, an endpoint /api/dapps returns a curated list of Solana dApps (with metadata like name, description, URL, category, icons). Another endpoint /api/tx/status/:signature might return the status of a given transaction signature by querying the Solana RPC. These APIs simplify data retrieval for the client.


dApp Directory Management: The middleware can integrate with a database to store information about known dApps. This could be a simple JSON or a full database (SQL or NoSQL) depending on needs. It might periodically fetch updates from a community source or be manually curated. The Node layer formats this data and sends it to the frontend so users can discover new dApps easily.


Blockchain Data Aggregation: Using the Solana web3.js SDK, the Node server can query the blockchain for things like token prices (if integrating oracles or an API), recommended transaction fees, or on-chain statistics. It could also maintain cache of certain data to avoid redundant RPC calls. For instance, the server might cache the latest block height or recent transactions relevant to the user (if the user logs in or provides a public key, the server can fetch their recent transactions or token holdings to support the UI). By aggregating and caching, the Node layer reduces latency and load on the Solana RPC, improving the app’s performance.


Real-time Communication: The Node.js backend may also include a WebSocket server (using Socket.io or the native ws library). This would push events to clients: for example, if a new dApp is added to the directory, the server can notify all connected clients to refresh the list. More importantly, as the client submits transactions, the server can listen for confirmations. Solana’s RPC allows subscription to account changes or signature statuses (How to Create Websocket Subscriptions to Solana Blockchain using Typescript | QuickNode Guides). The Node server could subscribe to the user’s account or to specific transaction signatures and immediately push an update to the client when a transaction is confirmed, enabling real-time feedback (e.g., “Transaction confirmed!” notifications) (How to Create Websocket Subscriptions to Solana Blockchain using Typescript | QuickNode Guides).


Security Filtering and Proxy: As a security measure, the Node.js middleware can act as a proxy for accessing Solana RPC. Rather than the client directly calling arbitrary RPC methods, the client could call a secure endpoint on the server which in turn calls the RPC (with proper error handling and throttling). This allows centralizing access controls. For example, if certain RPC calls are expensive or should be rate-limited (to prevent abuse or preserve user device battery), the Node layer can enforce that. It also hides the RPC URL, so if the RPC endpoint or provider changes, only the server needs update. Additionally, the Node can log important actions for audit (without logging any private data) – e.g., logging transaction signatures for analytics or debugging.


Integration with Rust Modules: If certain functionalities are implemented in Rust for performance, the Node.js app would include native addons. For instance, heavy data processing (like parsing a large amount of blockchain data) could be done in a Rust library and the Node server calls into it. Another example: if running a local Solana validator as part of a developer mode, the Node service could manage that process (start/stop the solana-test-validator binary, or invoke Anchor CLI commands) via child processes.
The Node.js middleware thus serves as the brains for off-chain operations, enabling the client to remain lightweight. It ensures consistency (all clients get the same view of available dApps and network status) and adds a layer of protection between the clients and the blockchain.

2.3 Rust-Based Modules (Solana Blockchain Interface & Validator Operations)
Rust is utilized in this system because of its pivotal role in Solana development and performance-critical tasks. There are two primary contexts where Rust comes into play:
On-Chain Programs (Smart Contracts): The Solana blockchain uses Berkeley Packet Filter (BPF) bytecode for its on-chain programs, and the most popular language to write these programs is Rust (often using the Anchor framework). In our environment, while we are primarily building a browser/wallet, we might include some custom on-chain programs to extend functionality. For example, the environment might provide a transaction batching program or a social recovery program as a service to users, written in Rust and deployed to the Solana testnet. Anchor can be used to develop these, providing attribute macros and a structured approach to define accounts and instructions. Rust’s efficiency and safety (no null or memory leaks) is crucial for smart contracts, as they must run quickly and securely within Solana’s runtime (Building Solana DApps in 2024: Ultimate Guide).

 Development workflow: These Rust programs would be in a dedicated repository or folder (possibly within the same monorepo). They’re compiled to BPF and deployed to the validator (testnet) using Solana CLI or Anchor CLI. Once deployed, the client and Node can interact with them via their program IDs. For example, if there’s a program that the dApp browser uses to log certain user activities on-chain (just as an illustrative use-case), the Node server might send transactions to that program.

Off-Chain Rust Services or Libraries: We may implement parts of the middleware in Rust for performance or direct access to Solana’s lower-level APIs. One approach is using Rust to interface with the Solana validator node more directly than web3.js – for example, by using Solana’s RPC client libraries in Rust or even connecting as a validator peer for read-only data. Another off-chain use of Rust is cryptographic operations. While JavaScript has libraries for Ed25519, a Rust-based crypto module (using libsodium or ed25519-dalek) could be integrated for signing and key management, especially in the Node backend or even compiled to WebAssembly for use in the client. This could provide performance benefits and additional security (Rust’s type safety can reduce certain classes of errors).

Validator Node Operations: For development and testing, the system might include tools to manage a Solana Test Validator process. The test validator is essentially a local Solana blockchain instance. Rust is relevant here because the Solana Labs code (the validator software) is in Rust. Our application could either instruct developers to run solana-test-validator manually or automate it. For instance, during integration tests, a Rust script (or simply a Node script invoking CLI) could start a local validator, then the tests run against it. While not user-facing, this is part of the system’s development architecture.

In summary, Rust components ensure that the system can interface with Solana at a low level and run custom logic on-chain. Rust is the primary language for writing Solana programs (Building Solana DApps in 2024: Ultimate Guide), so using it aligns our system with Solana’s ecosystem. It provides the performance needed for high TPS blockchain interactions and the safety needed for key management and consensus-critical code. By using Anchor for smart contracts, we also get a well-defined structure for our Solana programs, and Anchor’s generated IDL (Interface Definition Language files) can be used on the client side to interact with those programs easily.

2.4 Embedded Wallet (Solana Key Management & Integration)

The embedded wallet is a cornerstone of the application, enabling users to securely manage their keys and interact with dApps without needing an external extension or app. Key features of the wallet component include:
Key Generation and Storage: When a user onboards, the wallet generates a new Solana keypair (or, if the user prefers, imports from an existing secret phrase). Solana uses the Ed25519 elliptic curve for keypairs (Solana Blockchain: Cryptographic Foundations and Architecture | by codebyankita | Medium), which the wallet implements via a trusted library (for example, tweetnacl in JavaScript or the Solana web3.js Keypair class). The private key is stored locally on the device. On web/desktop, it is encrypted with a user-supplied password and stored in local storage or a file (Electron can use OS-specific secure storage APIs or an encrypted file on disk). On mobile, we use secure storage (iOS Keychain, Android Keystore via React Native libraries) to store the key or the recovery phrase encrypted. The system never sends private keys off the device, and backup/export is only done when the user explicitly chooses (showing them a recovery phrase or letting them save an encrypted backup file).


Ed25519 Cryptography: The wallet performs digital signing using Ed25519. Every transaction or message that needs to be signed is passed to the wallet’s signing function, which uses the private key to produce a signature. This is done with well-tested cryptographic libraries to ensure security and correctness. (In JavaScript, TweetNacl is often used – it’s audited and widely used for Solana signatures. In Rust, ed25519-dalek could be used.) The public key (also the wallet address) is derived and shown to the user as their Solana address. The system may also support derivation paths and multiple accounts from a single mnemonic (using BIP44 paths for Solana) if multi-account support is desired.


Transaction Handling: The wallet can construct and sign Solana transactions. For example, if a dApp requests a token transfer, the wallet module will assemble a transaction (or verify the one provided by the dApp), prompt the user, and upon approval, sign the transaction. The signed transaction is then either returned to the dApp (to be sent via the dApp’s connection) or sent directly to the blockchain via Node or RPC. Since the wallet is integrated, we have flexibility: we might let the Node server broadcast the transaction (the wallet can send the signed TX to Node via a secure channel), or the wallet itself can use solana-web3.js to send it to the network. Either way, the design ensures the private key never touches the Node server – only the signature does.


Wallet Adapter Interface: To maximize compatibility with existing Solana dApps, our wallet implements the Solana Wallet Adapter standard. This means the injected window.solana object (in the dApp WebView) follows the interface that dApps expect (with methods like connect(), signTransaction(), signMessage(), etc.). According to Solana’s documentation, any web app that needs to use a wallet connection should use Wallet Adapter (Interact With Wallets - Solana). By conforming to this, our environment can connect to virtually any Solana dApp seamlessly – the dApp will think it’s dealing with a standard wallet (like Phantom or Solflare) and will work out-of-the-box. On React Native, because we control both the dApp WebView and the wallet, we effectively simulate the Wallet Adapter bridge internally. We also ensure that only permitted calls are allowed – for instance, a dApp cannot arbitrarily call signTransaction without the user having approved a connection.


User Authentication & Onboarding: During onboarding, the user might create a PIN or password that encrypts their wallet. Each time the app is opened (or periodically), the user may need to authenticate (enter password or use biometrics on mobile) to decrypt the key for use. This prevents someone with access to the device from using the wallet. The system might use device biometrics integration (Touch ID/Face ID on iOS, BiometricPrompt on Android) to unlock the key for convenience with security.


UI Integration: The wallet provides UI components for the user to see their assets. For example, a “Wallet” screen will show SOL balance, token balances (using on-chain lookup via Node or direct RPC), and perhaps NFTs or recent activity. There are also UI prompts that the wallet triggers:


“Connect to dApp?” prompt showing the dApp’s name/URL and requesting user approval (one-click to connect).


“Approve Transaction” modal, showing details of the transaction (like “Send 0.1 SOL to XYZ address”) with Approve/Reject buttons.


These prompts are designed to be clear and secure – including information like the origin of the request (dApp URL) and what exactly will happen (decoded transaction details if possible). This is to prevent phishing and ensure the user understands what they are signing.


Multi-Account and Network Support: Within the wallet, users can manage more than one account (keypair). They might have a primary wallet and a secondary wallet and be able to switch. Also, the wallet can connect to different Solana networks – in development it defaults to Testnet/Devnet, but it could allow switching to Mainnet beta in the future. Each network is treated separately in terms of account balances and transaction history. The UI would clearly indicate the active network to avoid confusion.


Security Measures: The wallet implements several security best practices:


Timeouts: If the user is idle, lock the wallet (require re-authentication).


Approval per Site: Remember which dApps the user connected to, and allow revocation of permissions. Even though Solana’s model typically requires approval per transaction, knowing which dApps have wallet access helps user trust.


Phishing protection: Display the URL of the dApp in connection prompts and perhaps maintain an internal list of known dApp URLs (from the directory) versus unknown ones, warning the user if a dApp isn’t verified.


No secret exposure: Ensure that even in memory, secrets are zeroed out when not needed, and that logging never prints sensitive info. Use secure random number generation for key creation.
In essence, the embedded wallet turns this application into a fully functional Solana wallet similar to Phantom (browser extension) or Sollet, but available on mobile and desktop natively. It leverages Solana’s Ed25519 cryptography for key pairs (Solana Blockchain: Cryptographic Foundations and Architecture | by codebyankita | Medium) and follows the standard wallet connect protocol so that any Solana dApp can be used seamlessly within our app.
2.5 dApp Discovery Interface
The dApp discovery interface is the component that transforms this application from a standalone wallet into a browser of Solana dApps. It provides a user-friendly way to find and interact with various decentralized applications on the Solana network. Key aspects of this component:
Directory Listing: The interface shows a list of dApps, likely in a visually appealing grid or list with icons and names. These dApps can be categorized (DeFi, NFT, Games, Tools, etc.) for easy browsing. We maintain this list via the Node.js backend (which may fetch from an external source or a curated list). Each entry includes the dApp name, a short description, and perhaps user ratings or tags. This is similar to an “app store” but for decentralized apps.


Search and Filters: A search bar allows users to quickly find a specific dApp by name. Filters or tabs can let users narrow down to categories or sort by popularity/newness. The Node backend can supply popularity metrics (if available, e.g., number of users or transactions, possibly via an analytics API or on-chain data).


dApp Details Page: Clicking on a dApp could bring up a details view showing more information: screenshots, detailed description, the official URL, and a “Launch” button. It might also show whether the dApp is verified or audited (we could integrate data from Solana’s official dApp store or community sources to mark trusted dApps). This helps users make informed decisions before connecting their wallet.


Launching dApps: When the user decides to use a dApp, the interface will open the dApp’s URL in the embedded browser environment (WebView for mobile or a new window/webview in Electron for desktop). The UI should clearly transition from the catalog view to the dApp view, perhaps showing the dApp’s name and URL at the top (like a browser address bar) for context. There should also be controls like refresh, back, or exit to leave the dApp and return to the directory.


One-Click Wallet Connect: Because the wallet is integrated, launching a dApp can immediately prompt the user to connect their wallet. The flow would be: open dApp → dApp’s code detects window.solana and calls connect() → our wallet intercepts this and if user hasn’t approved this site before, show the connect prompt → user approves with one click. After that, the dApp considers the wallet connected (it has the public address) and can request transactions. This “one-click” experience (after the initial approval) means returning users won’t have to approve again, making it seamless.


Security Isolation: The dApp is loaded in an isolated context. For mobile WebView, we enable settings like originWhitelist and disable any risky features (no file access, no universal access to other websites, etc.). Similarly, in Electron, we use context isolation, preventing the dApp from accessing Node.js APIs or anything outside the sandbox. The only bridge available to it is the controlled wallet API. This isolation ensures a malicious dApp cannot escape the sandbox or tamper with the rest of our app.


In-App Browser Features: To enhance the user experience, the dApp browser could have features like:


Tabbed browsing (maybe a user can open multiple dApps in tabs, at least in the desktop version).


Favorites: user can bookmark certain dApps for quick access.


History: a list of recently visited dApps.


Forward/back navigation within a dApp.


The environment might also inject some UI overlays, such as a button to quickly open the wallet or a notification if the dApp is trying to do something (like when a transaction request pops up, we might dim the dApp view and show the wallet modal).


Updates and Dynamic Content: The dApp list should update without requiring the app to update. By having the list come from the backend, new dApps can be added regularly. We might integrate with the official Solana dApp Store (if available via API) or community-maintained lists so that users see the latest projects. There could also be a “feature” section highlighting popular dApps or new arrivals. This dynamic content keeps the browser aspect of the app lively and useful.
Through the dApp discovery interface, users of our application can explore the Solana ecosystem easily, rather than just manually entering URLs. It lowers the barrier to entry for trying out new dApps and provides a curated experience which can help avoid scams (since we can vet the list). Essentially, this component is what turns our wallet into a full Solana Web3 Browser by not only letting the user interact with known sites but helping them find dApps in the first place.
3. System Workflow
This section describes the end-to-end workflow of the system, from a user’s perspective and the underlying system processes. We’ll cover user onboarding, connecting to the blockchain, browsing dApps, authenticating with the wallet, and receiving real-time updates. Each step ensures security and a smooth user experience.
3.1 User Onboarding and Wallet Creation
Installation & Launch: The user installs the app on their device (web browser loads the app, mobile via App Store/Play Store, desktop via an installer). On first launch, the app detects no existing wallet and starts the onboarding flow.


Welcome & Tutorial (optional): The app may show a brief introduction to Solana and Web3, or at least a welcome screen for context. Given many users might be new, a quick onboarding tutorial can help them understand that this app will act as their wallet and gateway to Solana dApps.


Wallet Setup: The user is prompted to create a new wallet or import an existing one:


Create New: The app generates a new 24-word mnemonic (BIP-39 seed phrase) and displays it to the user with instructions to back it up securely. The user must confirm they wrote it down (often by having them select a few words in order as verification).


Import: The user can enter an existing seed phrase to restore a wallet. The app handles deriving the Solana keypair from this seed.


In both cases, a Solana Keypair is derived (using Ed25519 as underlying algorithm). The public key (address) is shown to the user as their new account.


Secure Key Encryption: Next, the app asks the user to set a password or PIN. This will be used to encrypt the private key on the device. On mobile, instead of a password, we might allow device biometrics or a PIN code. The encryption uses a strong KDF (key derivation function) and cipher (e.g., AES256-GCM) to encrypt the seed or private key. The idea is that even if someone gets a hold of the device’s storage, they cannot use the wallet without this password/biometric. The user will also use this to unlock the app in future sessions.


Account Setup Completion: Once the wallet is created and secured, the app is ready. The user sees their Dashboard or Wallet screen, likely showing a zero balance (if new wallet on testnet). We might optionally give them some testnet SOL automatically (some apps request airdrop from the devnet faucet for user convenience, if we connect to devnet) so they can immediately try transactions on testnet.


Network Connection: By default, the app connects to a Solana testnet (or devnet) RPC endpoint. This could be a public endpoint (like Solana’s official devnet RPC) or our own Node service URL. The connection is established – if using solana-web3.js on the client, it creates a Connection to the cluster RPC URL. If going through our Node, the app ensures the Node is reachable (likely through a health-check API call). At this point, the app can display network status (maybe “Connected to Solana Devnet” indicator). If the Node or RPC is down, the app would show an error state for connectivity.


Syncing Initial Data: The app fetches initial data required:


The list of dApps (GET /api/dapps) to populate the discovery interface.


The user’s account info – balance and perhaps token accounts. This can be done by calling Solana getBalance RPC for the user’s public key (How to Create Websocket Subscriptions to Solana Blockchain using Typescript | QuickNode Guides) and calling getTokenAccountsByOwner to list token holdings, possibly via Node or direct.


Any user-specific settings stored from before (if first time, none; if returning user, maybe preferences like dark mode or an address book).


Real-time subscriptions might also start here: the app could subscribe to the user’s account on the blockchain to listen for balance changes (How to Create Websocket Subscriptions to Solana Blockchain using Typescript | QuickNode Guides). This is done via web3.js’s onAccountChange or our Node’s socket.
The onboarding is now complete – the user has a functioning wallet and is connected to the Solana network in a test environment. All of the above happens with clear UI feedback, progress indicators (especially when generating keys or encrypting which might take a moment on low-end devices), and thorough guidance to ensure the user feels comfortable with what they just set up.
3.2 Browsing the dApp Directory and Selecting a dApp
Exploring dApps: On the main interface, the user can navigate to the “Browser” or “dApp Explorer” section. Here they see the list of featured dApps, categories, search bar, etc., as described in section 2.5. Suppose the user searches for a particular dApp or chooses one from a category (e.g., a decentralized exchange or an NFT marketplace).


Viewing Details: The user taps/clicks on the dApp’s listing. A details page pops up with the description and a “Launch” or “Connect” button. The app might fetch additional info here (if not already loaded) such as live stats or user reviews, though initially, a simple static info is fine. The user decides to proceed and hits the Launch button.


Launching dApp in WebView: The application opens the dApp’s URL in the integrated browser.


On mobile: this means rendering a new screen that contains a WebView (React Native’s WebView component) pointing to the dApp URL (e.g., https://example-dapp.com).


On desktop: possibly opening a new Electron BrowserWindow or a tab in the existing window that navigates to the URL. Before the dApp content loads, our app injects the Solana provider script. This injection might be done by specifying injectedJavaScriptBeforeContentLoaded for RN WebView (to ensure the script is there from the start) or preload script in Electron. The injected script registers window.solana with the appropriate methods and event emitters per Wallet Adapter spec.


dApp Interface Loads: The dApp’s HTML/JS runs inside the sandbox. It typically will detect the presence of window.solana and may automatically attempt to connect, or it will render a “Connect Wallet” button for the user inside the dApp UI. From the user’s perspective, they now see the actual dApp as if they had opened it in a normal browser, except that it has the wallet built-in.


Wallet Connection Request: Assuming the dApp tries to connect (most will either on page load or when the user clicks connect in the dApp), a message is sent from the WebView to our native app context – basically window.solana.connect() triggers our injected handler, which then communicates to the React Native/Electron code that a connection is requested. Our app now pops up a Connect Wallet prompt to the user. This prompt will show something like “example-dapp.com wants to connect to your wallet.” and perhaps what permissions that implies (on Solana, connecting just gives the dApp your public key and ability to request transactions, there’s no account control transfer).


User Approves Connection: The user clicks “Connect” in our prompt. The app now:


If this is the first time connecting to this dApp, store the approval (so next time we might auto-connect or at least not prompt again in this session).


Inform the dApp by resolving the connect request with the public key. In practice, window.solana.connect() returns the public key array or object. Our injected script sends the user’s public address to the dApp’s JS, completing the connection handshake.


The dApp now thinks the wallet is connected and typically will update its UI (e.g., showing the user’s address or account info on the dApp interface).


This entire wallet connection is just one click for the user after launching the dApp, which streamlines the experience (no need to copy/paste addresses or scan QR codes as with external wallets).


3.3 dApp Interaction and Transaction Flow (Single-Click Authentication)
Now that the user is connected to the dApp through the wallet, they can fully interact with the dApp’s features. Let’s go through a typical interaction scenario, such as the user making a transaction on the dApp:
Initiating an Action on dApp: Suppose on an exchange dApp the user wants to swap tokens, or on an NFT marketplace they want to purchase an NFT. The user uses the dApp’s UI to set up the transaction (select token amounts, etc.) and then clicks the dApp’s own “Submit” or “Swap” button.


dApp Requests Transaction Signature: The dApp, upon form submission, creates a Solana transaction (using @solana/web3.js in the dApp or calling its backend). It then calls window.solana.signAndSendTransaction(tx) or the recommended flow: signTransaction followed by a separate RPC send. In either case, this call is caught by our injected provider, which sends a message to the native app portion indicating a transaction request along with the transaction data.


Displaying Transaction Details: Our app opens a Transaction Approval modal. It reads the transaction data – using Solana’s SDK to decode the instructions for user comprehension. For example, if the transaction is a token transfer, we translate that to “Transfer 10 USDC to Alice”. If it’s more complex (multiple instructions), we list them or just warn if it’s from an unknown program. Because we have Anchor IDLs for known programs (if we include them or fetch on the fly for popular ones), we could decode custom program calls into something understandable. At minimum, we show the raw info: which addresses are being interacted with and any SOL being sent. The user sees this information and can either Approve or Reject.


User Approves Transaction: If the user taps Approve, the wallet module uses the stored private key to sign the transaction bytes (this happens in-memory and uses the cryptography module). The app then proceeds to send the signed transaction. There are two possibilities:


Direct RPC Submit: The client directly submits the signed transaction to the Solana network. In the mobile app, this could be done by calling connection.sendRawTransaction(signedTx) via solana-web3.js pointing to the RPC URL of the testnet. In the desktop app, similarly using web3.js or even the Node integration in Electron to call RPC. The RPC endpoint might be our Node server’s proxy or a public one.


Via Node Middleware: Alternatively, the signed transaction (often base64 encoded) is sent via an API call to our Node backend (e.g., POST /api/transactions) and the backend then forwards it to the Solana cluster using its connection (this could be useful if we want the backend to track the transaction for notifications). The Node can then return the transaction signature immediately.


Either way, the result is we get a transaction signature (hash) for the submitted transaction.


Real-Time Confirmation: After sending, the UI shows a pending state (“Transaction Submitted... Waiting for confirmation”). Thanks to Solana’s fast finality, on testnet this might clear in a few seconds. The app can use WebSocket subscription to wait for confirmation:


If the client submitted directly, it can use connection.onSignature(signature, callback, 'confirmation') to be notified (How to Create Websocket Subscriptions to Solana Blockchain using Typescript | QuickNode Guides).


If the Node handled it, our backend likely subscribes to that signature or at least polls its status, and once confirmed, emits a WebSocket event to the client. Additionally, if this transaction changes the user’s balance or token holdings, our app (which subscribed to account changes at onboarding) will get an accountChange event with the new balance (How to Create Websocket Subscriptions to Solana Blockchain using Typescript | QuickNode Guides). That allows us to update the wallet UI immediately (for example, if 0.01 SOL was spent as fee, the SOL balance label will decrement accordingly in real time).


User Receives Confirmation: The pending state is replaced with a success message: “Transaction Confirmed.” We might display a checkmark animation or similar satisfying feedback. Also, if implemented, a push notification could fire (mobile) or a desktop notification, saying “Your swap on [dApp Name] is complete.” The dApp itself, running in the webview, also gets the result of the transaction. Typically, the wallet provider returns the signature to the dApp’s JavaScript, so the dApp knows it was submitted. The dApp might then fetch the transaction status or wait for our wallet to emit a “confirm” event. In a wallet adapter context, the provider often emits an event on connection like on('disconnect') or others; for simplicity, we might just resolve the promise after sending and let the dApp poll for confirmation. Many dApps will query the network for the transaction status or expected outcome (e.g., new token balance) and then update their UI (e.g., showing the swapped tokens). Our environment doesn’t need to intervene in that – it’s handled by the dApp logic.


Repeating Interactions: The user can continue to use the dApp, making more transactions, which each time will trigger the wallet approval modal. If at any point the user rejects a request, we send an error back to the dApp (so the dApp knows the user canceled) and no transaction occurs.


Switching dApps: The user can exit the dApp (go “Back” to the dApp list) at any time. The session with that dApp could be kept (we might keep the webview in background or just remember that it was connected). If they return to that dApp, they might not need to reconnect if the session is still alive. The wallet adapter usually keeps the connection until the page is reloaded or an explicit disconnect. We might also implement an auto-disconnect after a long period for security.
3.4 Real-Time Data Updates and Notifications
Throughout the above flows, the system emphasizes real-time feedback to the user, leveraging Solana’s capabilities and our infrastructure:
Account Change Subscriptions: As mentioned, once the user’s public key is known, the app subscribes to that account on the Solana validator. Using the accountSubscribe RPC via WebSocket, the app will be notified whenever the account’s lamports (SOL balance) or data changes (How to Create Websocket Subscriptions to Solana Blockchain using Typescript | QuickNode Guides). Similarly, it can subscribe to token accounts to know if token balances change (e.g., from an airdrop or external transfer). This means if the user receives funds or spends funds outside of our app (say they have the wallet open on two devices, or someone sends them SOL), the balance shown updates within seconds without manual refresh.


Program Subscriptions: The app could also subscribe to certain programs or events if relevant. For example, if the user is on a DeFi dApp, perhaps subscribe to that program’s events to see real-time market info. However, this is more app-specific and likely left to the dApp itself. Our environment mainly ensures the user’s own data is live.


Node Backend Push: Our Node server, if in use for relaying, can also push updates. For instance, after a transaction, the Node might push a notification “Transaction X confirmed in slot Y”. Or if we have a news feed of dApp updates (maybe a dApp added to the directory or an announcement), that can be pushed to the client.


In-App Notifications: We integrate a notification center in the app UI. This could list recent events such as:


“Connected to Example DApp”


“Sent 5 SOL to Alice – Confirmed ✅”


“New dApp added: Solana Chess”


These notifications make the app feel alive and keep the user informed of background happenings. On mobile, important ones also trigger OS notifications (via React Native’s PushNotification or Firebase Cloud Messaging if needed). On desktop, Electron can trigger system notifications for events like transaction confirmations.


Polling as Fallback: In case WebSockets aren’t reliable on some platforms or networks (maybe mobile networks cutting off long connections), the app can fall back to polling the Node or RPC at intervals for critical info (like balance changes or tx statuses). This ensures even if real-time subscription fails, the user eventually sees updated info (with perhaps a slight delay).


Validator Health and Network Status: The app also keeps an eye on network status. If the connection to the Solana node is lost or the RPC is slow, we inform the user (“Connecting to network...”). If the user’s internet drops, we also detect that and possibly switch to offline mode gracefully (see optional offline mode section). This might involve pausing any actions and queuing them.


Disconnect Workflow: If a user decides to disconnect the wallet from a dApp (maybe we provide a “Disconnect” button in the wallet UI for each connected dApp), the workflow is: user triggers disconnect -> our app notifies the dApp via the provider (dApp will usually handle by resetting its state) -> we wipe any cached permissions for that dApp. From then, if the dApp wants to connect again, the approval prompt will show again. This is part of maintaining secure sessions.
By handling the above workflows, the system provides a smooth yet secure experience: a user can go from zero to exploring and transacting in the Solana ecosystem within minutes. All complex interactions (key signing, network communication, consensus waiting) are abstracted behind simple user actions (click “Approve”) and the system works in real-time to reflect the results of user’s actions, which is essential for a good UX in a blockchain application where confirmation times, however short, are still perceptible.
4. Technology Stack
The project leverages a range of technologies across the stack, chosen for their suitability to the requirements (cross-platform capability, performance, Solana compatibility, and developer productivity). Below is a breakdown of the technology stack for each component:
Frontend (Web & Desktop):


Language & Framework: JavaScript/TypeScript, React. Using TypeScript helps catch errors early and provides type safety across the codebase (especially important when dealing with cryptographic types, transaction objects, etc.).


State Management: React’s Context API and Hooks for simple state, possibly Redux Toolkit or Zustand for more complex global state (like managing the wallet state, dApp list, etc.).


UI Library: Tailwind CSS for styling on the web. Tailwind offers utility classes for rapid UI development and ensures a consistent design. The design system will be responsive so it works for various screen sizes. For desktop (Electron), the same Tailwind-styled React components can be used. We might also use component libraries or headless UI components for common elements (dropdowns, modals) to speed development.


Desktop Packaging: Electron. It provides a Chromium browser and Node.js runtime for the web app, enabling us to call OS-level modules (file system, notifications, etc.). We will use Electron’s features like auto-update (so users get new versions easily) and secure context isolation for the embedded dApp windows.


Communication: Within Electron, main/renderer processes communicate via IPC; in React web app to Node backend via HTTP/WebSocket (using libraries like Axios for HTTP, and Socket.io or native WebSocket API for realtime).


Testing (Frontend): Jest and React Testing Library for unit/integration tests of React components. For end-to-end tests, possibly using a framework like Cypress (for web) to simulate user flows in a browser.


Frontend (Mobile):


Language & Framework: JavaScript/TypeScript, React Native (Expo). Expo is used for ease of development and deployment; it provides many libraries out-of-the-box and OTA update capabilities. If needed for deeper native integration (like Solana Mobile Stack features on Android), we can eject or use config plugins.


Navigation & UI: React Navigation for screen transitions, and Tailwind-like styling via NativeWind or similar. We might also use React Native Paper or UI Kitten as component libraries to get pre-styled components consistent with Material or iOS design (though heavily theming to match our brand).


Secure Storage: Expo SecureStore or React Native Keychain for storing the encrypted keys. These use iOS Keychain/Android Keystore under the hood.


Web3 Integration: We include @solana/web3.js in the React Native bundle (ensuring polyfills for Buffer, etc., are configured). Also, for Wallet Adapter interface, if available we incorporate @solana/wallet-adapter-react-native (or our custom implementation) to manage wallet context in RN.


Testing (Mobile): We use Jest for logic, and possibly Detox for end-to-end to automate the app (clicking buttons, etc., in a simulator).


Backend (Node.js & Express):


Runtime: Node.js (>=16 LTS) – chosen for its asynchronous capabilities and the fact that Solana’s JS SDK can run in Node. We will write the server in TypeScript for type safety.


Framework: Express.js for building REST APIs. It’s minimal and flexible. We might structure it with routes/controllers for clarity. If the project benefits from GraphQL (say we want to allow the client to query exactly what it needs, especially for the dApp list or user data), we could incorporate Apollo Server for a GraphQL API.


Solana SDK: @solana/web3.js – used on the backend to interact with the Solana network (e.g., to query account info, send transactions if needed, or listen via websockets). Node can maintain a persistent Connection to the cluster and share it across requests.


Database: Likely use a lightweight database for things like the dApp directory and user preferences. Options include:


SQLite (or PostgreSQL) if we want a SQL database – since Express can easily interface via an ORM like Prisma or an ODM.


MongoDB or Firestore if we prefer NoSQL – might be overkill unless we store user-specific data. For initial specification, even a JSON file or in-memory store might suffice for the dApp list (as long as the server restarts rarely).


Caching: In-memory caching (using Node’s process memory or something like Redis if distributed) can be used to cache RPC responses (like known token metadata, or rate-limited requests).


Authentication: The Node API might not need typical auth since the client is the wallet. But if we introduce user accounts or a cloud backup service, we might have JWT or API key auth. For now, the Node mostly trusts requests from the app (we could include an API secret in requests if worried about others hitting the API).


WebSockets: We can use Socket.io on Node and the client for simplicity to handle events. Alternatively, use the Solana web3.js subscription on Node side and then broadcast via Socket.io to connected clients.


Security: Use Helmet middleware for Express to set secure headers, rate limiter to avoid abuse of endpoints like /api/dapps. Also ensure all connections are over HTTPS.


Solana Blockchain and Rust:


Solana Network: We will typically connect to Devnet (for development and testing) and potentially Testnet for a more production-like environment. Devnet is public and doesn’t require running our own node, but for local development we can use solana-test-validator.


CLI Tools: Solana CLI (for airdrops, deploying programs) and Anchor CLI (for building/testing Rust programs). These are used during development and DevOps but not shipped to the end-user.


Rust Programs: Use Anchor framework to write any on-chain programs. Anchor will enforce a module structure, provide the #[program] macro for entrypoints, and allow us to define Accounts structs for input. We’ll maintain these in a separate crate. We ensure to write tests for them (Anchor provides a Mocha-like testing framework in TypeScript and Rust integration tests). Once built, we use anchor deploy or Solana CLI to put them on the chain.


Rust off-chain: If we decide to implement a native module, we will set up a Rust project (probably using Neon to create a Node addon). This could be for cryptography or possibly a custom high-performance indexing of blockchain data. Rust’s Cargo tooling will manage dependencies (like solana-client crate if we use it). We’d compile it for relevant platforms and include it in the Node server deployment.


Ed25519 Libraries: For consistency with Solana, we might use the tweetnacl library in JavaScript (already included in solana-web3.js) which implements Ed25519 (Solana Blockchain: Cryptographic Foundations and Architecture | by codebyankita | Medium). In Rust, if needed, use ed25519-dalek or Solana’s own ed25519_program crate for signing and verifying.


Anchor Client: Anchor generates IDLs and client code (in TypeScript) for the deployed programs, which we can include in the frontend if the dApp browser itself wants to interact with them. However, since our app is mostly a browser, we might not need that unless our wallet or directory has on-chain governance or logging.


Security & Utilities:


Encryption: Use Web Crypto API or Node’s crypto module for things like hashing, random number generation (for key seeds), and encryption (for secure storage). For example, use window.crypto.getRandomValues for seed generation on the client.


Communication Security: All network calls use HTTPS and WSS. Our own Node server will have an SSL certificate. We might use libraries like Axios (which uses HTTPS under the hood) and ensure certificate verification. On mobile, the OS handles HTTPS by default through fetch. If high security is needed, implement certificate pinning in mobile (to ensure the app only talks to our backend and not a man-in-the-middle).


Libraries: Other helpful libraries and frameworks:


Metaplex JS: If we want to display NFTs or interact with token metadata, Metaplex’s SDK could be used.


Wallet Adapter: On the web React side, using @solana/wallet-adapter-react to manage state of our wallet adapter integration (though we only have one wallet – our own).


Sentry for error monitoring (both in client and server) during production to catch crashes or issues.


Mocha/Chai if using them for some testing in Node or Anchor.


Below is a summary table of major technologies:
Layer
Technologies & Tools
Purpose
UI – Web/Desktop
React, TypeScript, Tailwind CSS, Electron
Build responsive UI; Electron for desktop wrapper
UI – Mobile
React Native (Expo), TypeScript, React Navigation, Tailwind (via NativeWind)
Cross-platform mobile app, native device integration
Wallet Integration
Solana Wallet Adapter interface, TweetNacl (Ed25519), React Native SecureStore, Electron keytar
Key management and transaction signing, secure storage
Backend
Node.js, Express, @solana/web3.js, Socket.io, (optional: GraphQL/Apollo, Redis)
API server for data, blockchain proxy, realtime events
Database
SQLite or PostgreSQL (via Prisma) or simple JSON storage
Store dApp metadata, user preferences if any
Solana Blockchain
Solana Devnet/Testnet, Solana JSON RPC, WebSockets
Blockchain network for transactions and data
Smart Contracts (on-chain)
Rust, Anchor framework, Solana Program Library (SPL)
Custom on-chain programs (if needed), using Rust for Solana’s required high performance (Building Solana DApps in 2024: Ultimate Guide)
DevOps Tools
Solana CLI & solana-test-validator, Anchor CLI, Docker, Jest/Cypress for testing
Development, testing, and deployment utilities

This stack ensures that the application is built with modern, widely-supported technologies and is aligned with the Solana ecosystem’s best practices. By using React/React Native, we guarantee a unified development experience for cross-platform support (Solana dApp Cross-Platform Support - InstantNodes | Next-Generation RPC Solutions for Solana). Node.js and Rust cover the backend and blockchain sides, giving us both flexibility (Node’s JavaScript for quick development) and speed (Rust for heavy lifting). Security is maintained by using proven cryptography libraries and secure storage solutions. Throughout, TypeScript ties the layers together, allowing shared types (e.g., defining a Transaction interface or dApp metadata interface once and using it in client and server) and reducing bugs.
5. Security Considerations
Security is paramount in a Web3 application that manages private keys and funds. This section outlines the main security considerations and how the system addresses them:
5.1 Key Management & Encryption: The user’s private keys are generated and stored locally, never sent to any server. We employ strong encryption for any stored secrets:
On web/desktop, the key is encrypted using a key derived from the user’s password (using PBKDF2 or scrypt for key stretching). The derived key encrypts the mnemonic or the raw private key with AES-256. This ciphertext is stored (in IndexedDB or the file system). Only after the user enters the correct password (which is hashed and verified) do we decrypt and load the key into memory.


On mobile, the OS provides secure storage. For example, on iOS the Keychain is hardware-backed and accessible only to our app; on Android, the Keystore can store an AES key or use biometric protection. We take advantage of these by either storing the encrypted key similarly (with the user’s PIN as decryptor) or storing the key in the secure enclave accessible via biometric auth. In addition, the app can utilize platform features like biometric prompt each time a signature is requested (for extra protection, albeit with some user inconvenience).
5.2 Transaction Security & User Consent: Every transaction or message signature requires explicit user approval. There are no “auto-sign” features enabled by default. This means a dApp cannot drain funds or execute transactions without the user clicking “Approve” while viewing the details. The transaction details dialog is designed to be tamper-proof and clear:
We ensure the dApp cannot alter the appearance of the wallet prompt. In WebView/Electron, the dApp content is separate from the wallet UI, so it can’t inject misleading info into the prompt.


The prompt shows human-readable info whenever possible (we might integrate known token mint addresses to show token symbols, etc.). If something is unknown or complex, we warn the user (e.g., “This transaction interacts with an unknown program. Proceed with caution.”).


We use the concept of domains/origins similar to how browser wallets do: the dApp’s origin (URL) is displayed on the prompt. This helps the user ensure they intended to trigger this action on that site. It mitigates phishing where a malicious site could open a connection pretending to be another – the origin can’t be spoofed due to browser security.
5.3 Secure Communication (Client-Server and Client-Blockchain): All communication is encrypted:
The Node.js API endpoints are only accessible over HTTPS. We will obtain TLS certificates (using Let’s Encrypt or similar) for the server domain. This prevents eavesdropping or modification of data in transit. For instance, when the client fetches the dApp list or submits a signed transaction via the Node, an attacker on the network cannot alter it.


The Solana RPC calls from the client or server also use TLS (wss:// or https:// endpoints). If we connect to devnet.solana.com, that uses HTTPS. If we run our own validator RPC, we will enable TLS on it or place it behind an Nginx reverse proxy with TLS.


Internally, if the mobile app communicates between the WebView (dApp) and the React Native side, it uses the RN messaging API which is not exposed to other apps. In Electron, we enable contextIsolation and use the secure IPC channel – no remote module and no direct access to Node from the web content. This ensures the only way for the dApp to trigger wallet actions is via our vetted handlers.
5.4 Isolation of dApp Content: The dApp runs in a sandbox. It cannot access local resources or execute arbitrary native code:
In Electron, nodeIntegration for the dApp window is false, so it cannot call require('fs') or other Node APIs. Also, we use a preload script that only exposes a controlled API (the wallet interface). We will carefully sanitize inputs that come through this channel.


In React Native WebView, we set originWhitelist to only allow the intended domain or use allowingNavigations to constrain where it can go. We also intercept (via onShouldStartLoadWithRequest) any navigation attempts – if the dApp tries to navigate outside (maybe to a login page on another domain), we can handle that (possibly open in external browser or block if unsafe).


We disable any features like file downloads or geolocation in the WebView unless needed for a specific reason.
5.5 Preventing Malicious dApps: While we cannot guarantee all dApps are safe, our dApp directory can mark or exclude known malicious sites. We can maintain a blocklist of URLs that are known phishing sites; if the user tries to navigate to one (or if somehow a malicious link is in a dApp’s content and the user clicks it), we intercept and warn the user. This is similar to how browsers have safe browsing warnings. At least for our curated list, we vet them. For user-entered URLs (if we allow a manual URL entry feature), we might cross-check against a safe list.
5.6 Solana-Specific Security:
Nonce and Recent Blockhash: When the wallet creates a transaction to sign, it uses a recent blockhash. We must ensure it’s updated to avoid “duplicate signature” issues or transaction expiration. The Node server can help by providing a fresh blockhash quickly. This is more of a functional detail but ensures transactions are valid and not replayable after a certain time (once blockhash expires, the TX can’t be replayed).


Solana TX Size & Fee: We calculate fees in advance (via RPC). The wallet will warn if the user’s balance is too low to cover fees. This prevents transactions failing unexpectedly.


SPL Token Safety: If the user is sending an SPL token, our wallet checks if the destination address has an associated token account; if not, we either prompt to create one or warn the user (some wallets handle this automatically by adding a token account creation instruction; we could implement that to improve UX, but always with clarity to the user).


Phantom Compatibility: Because we follow the wallet adapter standard, many Solana dApps will treat our wallet like Phantom. Phantom has a known security model, and we aim to meet or exceed it. For example, Phantom doesn’t expose methods to dApps for arbitrary signing of messages without user consent, and neither do we.
5.7 Keypair and Seed Safety:
We strongly encourage the user to back up their seed phrase offline. The app will remind them to save it and possibly have a “backup completed” confirmation. We might even disable certain features until they acknowledge backing up (some wallets do this to stress its importance).


The seed phrase, once initially shown, is never displayed again unless the user explicitly goes to a “Reveal Secret Phrase” section which is gated behind password and warnings.


When importing a seed, we clear it from any UI element as soon as possible (so it’s not lingering in memory longer than needed).


We also need to handle when the user wants to remove a wallet – we provide an option to wipe the wallet from the device (for instance, if they are going to uninstall or switch accounts). This will securely delete the stored keys (overwriting memory, etc.).
5.8 Node.js Server Security:
The server will validate all incoming requests. For example, if there’s an endpoint to POST a signed transaction, it should ensure the data is correctly formatted (maybe using a JSON schema or manual checks). It won’t ever sign on behalf of the user (since it doesn’t have keys) – thus even if the server is compromised, it can’t directly steal funds (worst it could do is feed bad info or drop transactions).


The server should be hardened: use the latest Node LTS, avoid using vulnerable dependencies (we’ll run npm audit routinely), and possibly run the server in a Docker container with minimal privileges.


If the server provides any admin interface for the dApp list, that will be secured behind authentication and not exposed publicly.
5.9 Dependency and Update Management: We will monitor updates to Solana libraries (web3.js, wallet adapter, etc.) for security fixes. For example, if a vulnerability is found in a wallet adapter, we would update our app and push the update to users (Electron auto-update, mobile app store update). Our architecture with a central Node also allows some server-side updates without user action (like if we adjust something in the backend for security). We’ll also utilize any fuzzing or static analysis tools available for our Rust code since on-chain programs especially need to be bug-free (and possibly get them audited if they deal with value).
In summary, the system’s design takes a defense-in-depth approach:
The wallet is isolated and user-approved at every step.


Communications are encrypted and restricted.


We align with known secure standards (like Solana Wallet Adapter, which implicitly has security considerations built-in (Interact With Wallets - Solana)).


We also educate the user (through UI/UX) about security best practices (for instance, tooltips explaining why not to share their secret phrase, etc.).
By considering these aspects from the start, we minimize the attack surface of the application and protect both the user’s assets and their data privacy.
6. UI/UX Design Principles
A great user interface and experience are crucial for an app that aims to introduce users to Web3. We adhere to the following UI/UX design principles to ensure the application is clean, intuitive, and immersive across both desktop and mobile:
6.1 Consistency and Clarity: The design will maintain a consistent visual language. We’ll establish a theme (colors, typography, iconography) that resonates with the Solana brand (perhaps using its signature purple/teal hues) but also signals trust and modernity. All screens, from wallet to browser, will follow this theme. Consistent placement of elements (e.g., a bottom navigation bar on mobile for “Wallet”, “Browser”, “Settings”) means users can predict where to find things. We avoid clutter – each screen focuses on a primary action (e.g., the wallet screen focuses on showing balances and a “Send” button, the browser screen on listing dApps). Text will be jargon-free or, where blockchain terms are unavoidable, tooltips or info modals will explain them.
6.2 Responsive and Adaptive Design: The layout will adapt to various screen sizes. On mobile, the design uses a single-column flow, larger touch targets, and common mobile patterns (swipe gestures, pull-to-refresh in the dApp browser if needed, etc.). On tablets or desktop, we can show more information side by side. For instance, on desktop, the wallet sidebar might always be visible while the main area shows the dApp content – enabling quick switching between dApp view and wallet. We also consider orientation changes on mobile (e.g., if user rotates phone while in a dApp). Using Tailwind and React Native’s flexbox layouts makes it easier to create a responsive UI.


6.3 Intuitive Navigation: Navigation should be straightforward:
On mobile, use a tab bar or a drawer for main sections. A likely setup: Wallet, Browser, and Settings/Profile tabs. Within the Browser, navigating into a dApp opens a new screen (with its own back button).


On the desktop, maybe a sidebar or top menu for similar sections. Possibly a tab system for multiple dApps as mentioned.


Users can always get “Home” easily (like tapping the app logo returns to the main screen). There will be a visible back button when deep in a flow, to assure users they can undo an action.


Important actions like “Send” (to manually send SOL or tokens) are accessible (maybe a floating action button on the wallet screen).
We also incorporate smooth transitions between states. For example, when a user taps “Connect” on a dApp, the appearance of the wallet approval modal is animated (slide up or fade in) to feel natural and draw attention. After approval, it fades out to return to the dApp. These micro-interactions add polish.
6.4 Performance and Feedback: A key part of UX is the app feeling responsive. We ensure:
Fast Load Times: Use skeleton screens while content loads (for instance, while fetching the dApp list, show placeholders so the UI isn’t blank). For any action that takes more than a second, show a loading spinner or progress bar.


Feedback on Actions: If a user clicks a button, give immediate visual feedback (button highlight states). For network actions like sending a transaction, show a “sending...” status with perhaps an animation (e.g., an animated Solana logo or progress spinner). On success, show a checkmark or success message (and maybe a subtle confetti animation to celebrate, when appropriate – for example, first successful transaction).


Error Handling: Should an error occur (network failure, transaction failed, etc.), present a clear error message with possible next steps (“Transaction failed due to insufficient funds. Please top up your account and try again.”). Avoid generic or code-like errors; always translate to human-readable form. Provide retry options for transient errors.
6.5 Mobile-Friendly Interactions: On mobile devices, we leverage native features for a better experience:
Touch and Gestures: Use swipe gestures for ease – e.g., swiping right on the dApp list might open a menu, or swiping left on a notification could delete it. But we’ll do this only when it’s intuitive and won’t conflict with common gestures.


Haptic Feedback: Trigger subtle vibrations on critical actions like approving a transaction (to give a physical confirmation feeling) or on error (a quick double buzz to indicate something went wrong). This tactile feedback makes the app feel more interactive and alive.


Keyboard Management: Ensure that forms (like entering a seed phrase or amount to send) are well-managed: the screen scrolls up if needed, the correct keyboard type is shown (numeric for amount, etc.), and “Done” or “Next” buttons on the keyboard do the expected action.


Accessibility: Follow accessibility best practices by labeling interactive elements, ensuring good color contrast (especially since some Solana colors are bright, we will tune them not to hurt readability), and allowing font scaling. This ensures the app is usable by people with assistive needs.
6.6 Immersive Design & Visuals: We want to instill a sense of trust and modernity. Possibly include:
Animations & Transitions: Not just for feedback, but also decorative ones that don’t impede usability. For example, a slight parallax effect on the background of the dApp list when scrolling, or an animated Solana logo when the app launches (splash screen). We must balance this with performance – any heavy animation should be optimized or able to turn off.


Theming (Dark/Light mode): Many users prefer dark mode, especially in crypto apps. We will provide both light and dark themes. Tailwind makes it easy to switch themes (using a toggle and CSS variables). The design will be tested in both to ensure readability. The app could even follow the system theme by default.


Visual Cues for Security: UI will use subtle cues to indicate secure or dangerous states. For instance, when a dApp is verified by us, show a badge or a lock icon by its name. If the user is about to send funds to an address not in their contacts, maybe highlight the address in yellow to say “new recipient.” If they paste an address, the app could check if it’s a known scam address (if we maintain a list) and warn them. These cues help guide users safely.
6.7 Content Strategy: We’ll ensure that all text in the app is clear and helpful:
Use of tooltips or info icons next to complicated terms (e.g., “Testnet” might have an info icon explaining it’s fake money for testing).


The Settings section can have a “Help” or “Learn” area linking to documentation or FAQs. Possibly embed a few FAQs directly (“What is a seed phrase?”).


For any irreversible action (like removing a wallet or sending a large amount), ask for confirmation (maybe type “confirm”). This prevents accidents.
6.8 Cross-Platform UX Considerations: While we want a unified experience, we also respect platform conventions:
On iOS, we’ll use the default back swipe gesture and momentum scrolling in lists to feel native.


On Android, the hardware back button will be handled (should navigate back in our app rather than exit abruptly).


Desktop users expect some different behavior: e.g., hover tooltips (we can enable those in electron, whereas mobile uses long-press or an info button). Also, context menus on right-click (we might show options like “Copy Address” or “Reload dApp”).


Keyboard shortcuts on desktop: e.g., Cmd+R to refresh the dApp page (with a confirmation if there’s a submitted transaction perhaps), or Cmd+L to focus the dApp address bar (if we provide one).


Drag and drop: maybe let desktop users drag an image to the app to upload to a dApp if the dApp supports it (ensuring it stays within the sandbox). Not core, but an example of desktop parity.
In essence, the UX goal is that a user with minimal blockchain knowledge can pick up the app and use it intuitively:
They can create a wallet without confusion.


They can find a dApp and understand what it does.


When a dApp asks for something (connect or sign), the prompts are self-explanatory.


They feel in control and informed at all times (thanks to confirmations and status updates).


The app feels snappy and native on whatever device – leveraging each platform’s strengths, but maintaining functional consistency.
By prioritizing simplicity and familiarity (borrowing patterns from standard Web2 apps and existing wallet apps), we lower the learning curve for Web3. At the same time, we add delightful touches (animations, notifications) to make the experience engaging and “fun,” aligning with the excitement around Web3 and Solana’s vibrant ecosystem.
7. DevOps, Development Workflow and Deployment
To build, test, and deploy this cross-platform system effectively, we will establish a robust development workflow and DevOps pipeline. This ensures that all components (frontend, backend, etc.) work together seamlessly and that we can deliver updates reliably to all platforms.
7.1 Project Structure & Collaboration: We will use a monorepo (for example, managed by Yarn Workspaces or Nx) to house all parts of the project – this includes the React frontend, React Native app, Node backend, and Rust programs. A monorepo makes it easier to share code (like shared TypeScript types or utility functions) between client and server. Each component has its own directory and build scripts. We use Git for version control. Developers will follow a feature-branch workflow: creating feature branches, going through code reviews via Pull Requests on platforms like GitHub, and merging into a dev or main branch.
7.2 Development Environments:
Local Development:


Frontend: Developers can run npm start for the React app (launching it on localhost with hot reload) and expo start (or using Expo Go app) for the React Native app. We might create a unified command that spins up both, so they can test interactions (though they’re mostly separate UIs). Electron can be run in dev mode as well (with electron . loading the React dev server).


Backend: Run npm run dev for the Node server which starts it on a local port (with perhaps Nodemon for auto-reload on code changes).


Blockchain: For quick iteration, developers can use Solana Devnet (no setup needed, just internet). If needed, they can also run solana-test-validator locally to simulate the network entirely offline – beneficial for running backend tests deterministically. The test validator can be started with specific flags (like creating test accounts) as needed (Local Program Development - Solana).


Environment variables (managed via .env files) will define things like RPC_URL (devnet vs local), API endpoints, etc., to make switching between dev/staging/prod easy.


Testing: We implement tests at multiple levels:


Unit tests for utilities (e.g., a function that parses transaction data for display).


Component tests for React (using React Testing Library, checking that wallet modals render correctly given props, etc.).


Integration tests: e.g., spinning up a headless browser to test the web app connecting to a stub dApp page and ensuring the connect flow works (this can be done with a testing HTML that calls window.solana and verifying the result).


Backend tests: using a local Solana validator or devnet with a known account. For example, test that the /api/dapps endpoint returns expected structure, or that when posting a simulated signed transaction the server responds correctly.


End-to-end tests: possibly using Detox for mobile (launch app, simulate taps) and Spectron or Playwright for Electron (to automate a click through desktop UI). These ensure the full stack works (wallet creation -> send tx -> see result). Continuous Integration (CI) pipeline on a platform like GitHub Actions or GitLab CI will run these tests on each commit to catch regressions.
7.3 Continuous Integration & Deployment (CI/CD):
We set up CI to run on each push: it will lint the code (ESLint, perhaps Prettier), run all tests, and build the projects.


For the Rust smart contracts, we include cargo test in CI and maybe anchor test if applicable. Also, ensure the Rust code compiles to BPF (this can be part of CI, using Solana’s tooling to verify no compile errors for on-chain programs).


When changes are merged into the main branch and pass tests, we proceed to deployment steps.
7.4 Backend Deployment:
Containerize the Node.js server with Docker. We write a Dockerfile that sets up Node, copies the code, installs dependencies, and starts the server. This image can be deployed to a cloud service (AWS ECS, Google Cloud Run, Heroku, etc.).


Use staging and production environments: e.g., a staging server at a different URL that connects to Solana Devnet or Testnet, and a production server that (eventually) connects to mainnet. Initially, both might use Testnet until we are ready for mainnet.


Automated Deployment: Use CI/CD to deploy when code is merged to a particular branch. For instance, merging to main triggers deployment to staging (with testnet config), and a manual approval or a tag triggers production deploy.


Monitor the backend with logging and alerting. We might integrate a logging service or use something like PM2 to keep it running and gather logs.
7.5 Frontend Web Deployment:
The React web app can be built into static files (npm run build yields an optimized bundle). These can be served via a CDN or static hosting (Netlify, Vercel, or served by our Node server itself). If we anticipate heavy use of the web app, hosting it on a CDN for scalability is good.


Since the Electron app uses the same code, the web deployment doubles as a resource for Electron (or we package the files with Electron to be offline).


We will version the web app, and likely tie it with the backend version.
7.6 Mobile App Deployment:
We will use Expo for development, but for production builds, we might use EAS (Expo Application Services) to build standalone app binaries (APK for Android, IPA for iOS). Alternatively, eject to the bare workflow if needed for deep native customizations.


CI can automate building the app using EAS and even submitting to app stores via fastlane, though initially we might do that manually until stable.


We’ll register on Apple App Store and Google Play, ensuring to follow their guidelines (Crypto apps often need certain disclosures).


Beta testing: Use TestFlight for iOS and something like Firebase App Distribution or Google Play Internal Testing for Android to allow QA and beta users to test the app before public release.


Versioning: We will maintain proper semantic versioning for the app. Each release gets release notes (highlighting new features, fixes). Mobile users will get update notifications via the app stores.
7.7 Desktop App Deployment:
For Electron, we can use electron-builder to create installers for Windows (NSIS or AppX), macOS (dmg or zip, signed with Developer ID), and Linux (AppImage or deb).


Setting up code signing for Windows and macOS will be necessary to avoid warning dialogs on install.


We’ll enable Auto-update using either Electron’s autoUpdater with an update server or service like GitHub Releases. For example, when we publish a new version, the app can detect it and prompt the user to update (or silently download and apply on restart).


We might distribute the desktop app via the project website or GitHub releases. If we want broader reach, we could consider listing in Microsoft Store or Mac App Store, but those have additional requirements (especially Mac App Store is restrictive for crypto apps, so likely direct download is fine).
7.8 Dev/Staging/Production Configurations:
Maintain separate config files or environment variables for development, staging, and production. This affects:


RPC endpoint (Devnet vs Testnet vs Mainnet)


API base URL (local vs staging server vs prod server)


Feature flags (we might enable verbose logging or debugging features in dev builds that are off in prod).


The mobile and desktop apps built for production will point to the production backend by default. During testing, we’ll point them to staging.


Possibly allow an override (like a hidden setting in the app to switch RPC clusters, primarily for internal testing).


On the backend, ensure that when pointing to mainnet, all test-specific code (like requesting airdrops) is disabled, and any mainnet-specific configurations (like fee-payer if we sponsor fees, or certain endpoints that differ on mainnet) are handled.
7.9 Monitoring and Maintenance:
Set up monitoring for the backend: use something like Prometheus/Grafana or a cloud monitor to watch uptime, memory usage, and error rates. If the server goes down or errors spike, alert the dev team.


On the client side, integrate Sentry or a similar crash reporting tool into the React, React Native, and Electron apps. This will capture any runtime errors or crashes and report them (with user consent, according to privacy policy) to us, so we can fix issues promptly.


We’ll also monitor Solana network status (for example, subscribe to Solana status feeds). If Solana devnet is unstable, be ready to direct users to a different cluster or display a notification that the network is having issues (so users know it's not the app’s fault).
7.10 Deployment of Solana Programs:
If the project includes deploying custom Solana programs (smart contracts), our workflow will use Anchor to manage that. For dev/test, we can deploy to local validator or devnet in CI (perhaps on every merge we deploy a fresh instance for testing, although devnet persistence might be fine).


For mainnet, we’ll go through a more manual process, ensuring the program code is audited and then deploying with care (since upgrades are not straightforward without an upgrade authority set).


The program IDs and ABIs would be updated in the app as needed (which means if they change, we need to release new app versions or have the app fetch the IDL from a known location).
7.11 Documentation and Handover:
Part of the development workflow is maintaining good documentation: a README for how to run the project, and possibly a published doc for users (help center). We might use tools like Storybook to document UI components (useful for design system consistency).


We will keep an architecture document (much like this specification, kept up-to-date with any changes) for new developers joining the project.


Use issue tracking (JIRA or GitHub issues) to plan sprints and track progress, ensuring all the features described are implemented and tested.
By establishing this development and deployment workflow, we ensure that our team can rapidly iterate while maintaining quality. Automated tests and CI/CD catch issues early, and staging environments let us test with real blockchain interactions before users see changes. Because we have multiple platforms (web, mobile, desktop), coordination is key – versioning and compatibility are managed so that, for example, the mobile app and backend remain in sync regarding API endpoints.
Finally, the deployment strategy emphasizes reliability and user experience: even after deployment, we watch for errors or performance issues and can update the app (especially backend or web) quickly. Our users will always have access to the latest stable version, with minimal friction for updates.
8. Optional Enhancements
Beyond the core functionality, there are several enhancements we can incorporate to provide an even richer user experience and future-proof the application:
8.1 In-App Notifications & Alerts: We touched on this in real-time updates, but expanding it:
The app can include a notification center listing all relevant events (transaction confirmations, incoming transfers, dApp announcements). We can allow users to customize what they get notified about. For instance, a user might toggle on “Notify me of large incoming transactions” or “Notify me when a new dApp is listed.”


Integration with device notifications means even if the user isn’t actively using the app, they get important alerts. On mobile, we would integrate with Firebase Cloud Messaging (for Android) and APNs (for iOS) possibly via Expo’s notification service. For example, if a friend sends them some SOL and our backend picks that up (via websockets or polling), we could send a push notification “You received 1 SOL from Alice!”


Similarly, on the desktop, Electron can display a system tray notification. We’ll include controls so these notifications aren’t intrusive if the user wants quiet.


For dApp-specific notifications: perhaps the user can subscribe to a particular dApp’s news (if provided via an RSS or API feed) and our app could surface those (e.g., a DeFi dApp listing a new pool – the app could notify subscribed users).
8.2 Multi-Wallet/Account Support:
We plan for one wallet initially, but scaling to multi-wallet would let users manage multiple sets of keys. We could allow the user to add multiple accounts under the hood of the same seed (Solana can derive multiple accounts from one mnemonic using different derivation indices), or entirely separate keypairs.


The UI would then have an account switcher (similar to how Gmail app switches accounts or Phantom’s multiple wallet feature). Each account is isolated in terms of balance and usage, but the user can easily switch which one is active for dApps. This is useful e.g., to have a “test account” and a “main account” or segregate by use-case.


Implementation: our secure storage would then hold multiple encrypted keys, labeled maybe by account name. When the user switches, the wallet adapter exposes the new public key to dApps (likely triggering a disconnect/connect sequence).


We must ensure that switching is obvious to the user so they know which account they are using in a dApp at any given time. Maybe display the account nickname or the first and last characters of address in the nav bar.


If multi-wallet is complex for v1, a simpler interim is to allow one wallet but easy export/import so power users can switch by importing another key when needed (less elegant though).
8.3 Offline Mode & Caching:
We aim for functionality even with limited connectivity. An offline mode could allow the user to:


Open the app and view their portfolio (balances as of last sync, transaction history that was cached).


Perhaps compose transactions (like prepare a transfer) while offline and queue them to send later. This requires storing the signed transaction until connectivity returns. However, care: Solana blockhash will expire (~2 mins), so the transaction might not be valid by the time it’s sent. A workaround is generating the transaction but not signing until online, or allowing users to save it to sign later.


Browse the dApp list (if cached) and read descriptions, though obviously they cannot launch the live dApp without the internet. We could explore a feature like offline dApp pages if dApps provide some manifest or we cache their last loaded state, but that’s advanced and likely not generally feasible.


To support offline data, we implement a persistent cache:


Use IndexedDB or local storage (or SQLite for RN) to save key data like the dApp directory (update it when online).


Save recent transactions and balances. Perhaps sync the last 50 transactions for the user’s account and store them. That way, in offline mode, they can still open the app and see “You have 2 SOL (last updated 3 hours ago)” and a list of transactions/NFTs from history.


We also cache things like token metadata (names, logos) so that even offline the UI can show “You have 5 $USDC” instead of an unknown token.


The app should gracefully detect offline status (using network info APIs) and switch to an Offline UI state, informing the user with a banner “You are offline. Some features are unavailable.” But still allow navigation through cached info.


Once connection is restored, the app will sync any queued actions and update the cache.


This offline capability not only improves resilience but also performance (cache can speed up load of data on app start).
8.4 Cross-Chain or Multi-Chain Possibilities: Though our focus is Solana, the architecture (React, Node, wallet injection) could extend to other chains. If future expansion is considered:
We could integrate support for other networks in the browser, e.g., Ethereum dApps. This would mean supporting an EVM wallet (which our architecture could handle by adding an Ethereum account and using web3 providers injection). While not in scope now, the modular design of wallet adapter injection means in theory our app could switch context based on dApp chain.


Solana’s wallet adapter doesn’t inherently do other chains, but we could incorporate something like WalletConnect for non-Solana dApps if desired as an enhancement.
8.5 DApp Integrations: We can think of deeper integration with dApps:
For example, a dApp store rating system: users can rate or review dApps within our app. This would require a backend component (and possibly on-chain submission of reviews to avoid spam).


Social features: Being a browser, perhaps allow users to share a dApp link or their experience with friends (e.g., deep link to a specific dApp inside our app).


DApp Context Saving: The app could remember where you left off in a dApp. If you switch dApps or close the app, next time it could restore the last visited dApp (like browsers reopen tabs). This is an enhancement for user convenience.
8.6 Analytics and Improvements: (Internal enhancement)
Integrate privacy-preserving analytics to understand feature usage. For instance, track how many times users connect to various dApps (without logging their personal info or addresses), so we know which dApps are popular and can highlight them or optimize for them.


Track performance metrics (screen load times, transaction times) to find bottlenecks.


This helps in iterative improvement of the app’s UX.
8.7 Integration with Solana Saga (Mobile-Specific):
Solana’s Saga phone provides a secure element (Seed Vault) and Mobile Wallet Adapter. Our app could detect if it’s running on Saga and then use Saga’s native wallet instead of our own, or integrate with the Seed Vault to store keys (increasing security). This would make our app “Saga-ready”. It’s an optional platform enhancement for users who have that device.


Use of Android intents via the Mobile Wallet Adapter protocol could allow our app to serve as either a wallet or dApp in that ecosystem too.
Each of these enhancements can be added in a modular way, ensuring the core system is not over-complicated initially. We would likely prioritize based on user feedback:
Notifications and multi-account support are high-value for power users.


Offline mode is great for reliability (and some users with limited connectivity).


Other enhancements like ratings, cross-chain might come later as the user base grows.
By outlining these, we keep a roadmap in mind for the system to evolve beyond the initial specification, reinforcing the system’s goal: to be a one-stop, user-friendly gateway to the Solana (and broader Web3) world, on any device.

ScreenShots:

<img width="1792" alt="image" src="https://github.com/user-attachments/assets/10a09454-f099-436f-9370-bba184d20b73" />



<img width="1792" alt="image" src="https://github.com/user-attachments/assets/dbc700cd-e69f-47c7-a00d-e1d00d0c3320" />



<img width="1792" alt="image" src="https://github.com/user-attachments/assets/94c4a0b2-17ef-49bd-9fdf-d53be969f575" />



<img width="1792" alt="image" src="https://github.com/user-attachments/assets/c85b6932-6c02-4589-8fc2-741e1879c029" />



<img width="1792" alt="image" src="https://github.com/user-attachments/assets/c209aa9f-6844-4187-9774-8bc601f464f8" />



<img width="1792" alt="image" src="https://github.com/user-attachments/assets/533c5926-3056-46aa-8ae8-2e4d34a45d22" />



<img width="1792" alt="image" src="https://github.com/user-attachments/assets/7faec1d5-a151-44a3-a223-616fcf1b9a41" />



<img width="1792" alt="image" src="https://github.com/user-attachments/assets/781a413d-1ec3-4bdf-abf5-d9ee54a0aedf" />



<img width="1792" alt="image" src="https://github.com/user-attachments/assets/6070e0bf-2dd3-46d9-9528-d0f977a2a568" />



<img width="1792" alt="image" src="https://github.com/user-attachments/assets/1067e984-455e-474f-a727-e44377056ca6" />



<img width="1792" alt="image" src="https://github.com/user-attachments/assets/dc46ce60-19e6-43f2-b3a1-4c894b69c5a3" />



<img width="1792" alt="image" src="https://github.com/user-attachments/assets/4b6b45ba-0961-4ae7-a099-b4cd8853c7ec" />



<img width="1792" alt="image" src="https://github.com/user-attachments/assets/86216fdc-8a51-4d7a-bfe7-549e15fd0c3a" />



<img width="1792" alt="image" src="https://github.com/user-attachments/assets/3873a9d9-6eb4-45ac-8078-7947440d1f3e" />




