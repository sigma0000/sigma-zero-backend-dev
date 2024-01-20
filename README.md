<img src="https://i.imgur.com/wlfseTw.png" style="width:273px;">

# Sigma Zero Back-End

Back-End for Sigma Zero.

## Table of Contents

- [Installation](#installation)
- [Libraries](#libraries)
- [Usage](#usage)
  - [Setup the contract](#setup-the-contract)
  - [Setup the database](#setup-the-database)
  - [Start the server](#start-the-server)
  - [Scripts](#scripts)
- [Release Process](#release-process)
- [Creating Commits](#creating-commits)
- [Interacting with the DB](#interacting-with-the-db)
- [Interacting with the Contract](#interacting-with-the-contract)
  - [ContractService](#contractservice)
    - [Methods](#methods)
  - [Contract Getter](#contract-getter)
- [About paths and importing](#about-paths-and-importing)

## Installation

```
npm install
```

## Libraries

Libraries used by this project:

- `dotenv`: This is a zero-dependency module that loads environment variables from a .env file into process.env.
- `ethers`: This is a complete Ethereum library and wallet implementation. It allows us to interact with the Ethereum blockchain and its smart contracts.
- `express`: This is a fast, unopinionated, and minimalist web framework for Node.js. It's used for building web applications and APIs.
- `morgan`: This is a HTTP request logger middleware for Node.js. It simplifies the process of logging requests to your application.
- `pg`: This is a non-blocking PostgreSQL client for Node.js. It allows your application to connect to a PostgreSQL database and execute queries.
- `winston`: This is a multi-transport async logging library for Node.js. It's used for logging and can log to multiple storage systems, like files and databases.

## Usage

### Setup the contract

In order to be able to connect to the contract, you need to setup the following env vars in the `.env` file:

```
RPC_URL=
PRIVATE_KEY=
CONTRACT_ADDRESS=
```

- `RPC_URL`: the URL of the RPC (Remote Procedure Call) endpoint. For example: https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161

- `PRIVATE_KEY`: the private key associated with the account that was set as admin in the contract.

- `CONTRACT_ADDRESS`: the address of the smart contract deployed on the blockchain.

### Setup the database

Before starting the server, you need to setup the database env vars:

```
PGHOST=
PGUSER=
PGPASSWORD=
PGDATABASE=
PGPORT=
```

### Start the server

```
npm run dev
```

### Scripts

The `package.json` file has the following scripts:

- `dev`: This script runs your application using Nodemon, a utility that automatically restarts your Node.js application when file changes are detected in the directory. The Nodemon config is in the `nodemon.json` file.

- `build`: This script first uses rimraf to delete the ./build directory and then runs the TypeScript compiler (tsc) to compile your TypeScript code into JavaScript. The compiled code is output to the ./build directory.

- `start`: This script first runs the build script to compile your TypeScript code, and then starts your application by running the compiled server.js file in the ./build directory.

- `lint`: This script runs ESLint, a tool for identifying and reporting on patterns in JavaScript, on all TypeScript files in your project.

- `lint:fix`: This script is similar to the lint script, but it also automatically fixes problems in your code that can be fixed by ESLint.

- `test`: This script runs your tests using Node.js' Test Runner, matching all .ts files in the ./src/tests directory and its subdirectories. It requires the ts-node module to allow Node.js to require and run TypeScript modules.

## Release Process

Here's our approach for the release process:

1. **Development**: All development work should be done in feature/fix branches that are created from the `dev` branch, using `feature/nameOfFeature` or `fix/descriptionOfFix` as the name of the branch.

2. **Pull Request**: Once the work on a feature/fix branch is complete and tested, a pull request should be created to merge the changes into the `dev` branch.

3. **Testing**: After the changes are merged into `dev`, further testing should be done.

4. **Merge to Main**: Once all tests pass on the `dev` branch, it can be merged into the `main` branch.

5. **Tag Release**: After the `main` branch has been updated, tag the commit with the new version number.

6. **Deployment**: Deploy the application from the `main` branch to your production environment. This will probably be done using a CI/CD pipeline.

7. **Hotfixes**: If a critical issue is found in production, a `hotfix` branch can be created from `main`, and the fix can be developed on this branch. After testing, this branch can be merged back into both `main` and `dev`.

## Creating Commits

This project is setup with `TypeScript`, `eslint`, `prettier`, `husky`, and `lint-staged`.

That means that every time you try to commit, `husky` will run `lint-staged`, which in turn will run the linter, to catch (and possibly fix) any issues with the code, including TypeScript and style errors.

We recommend you setup your IDE to show these errors and autoformat the code with `eslint`, to avoid issues at commit time.

## Interacting with the DB

The file `src/db/index.ts` creates a connection to a postgresql DB. This is imported in the `src/server.ts` to initiate the connection.

After that, the `clientDB` can be imported where needed, by using `import { dbClient } from '@/db';`

## Interacting with the Contract

### ContractService

The ContractService class is a service that interacts with a smart contract using the ethers.js library. It provides methods to perform various operations on the contract, such as setting a bet value, voiding a bet, closing a bet, and calculating results and distributing winnings. More methods will be possibly added or changed as the project evolves.

#### Methods

- `constructor(contractGetter: ContractGetterBase, logger: winston.Logger)`: The constructor takes two parameters: a ContractGetterBase instance and a winston.Logger instance. The ContractGetterBase instance is used to get the contract that this service will interact with. The winston.Logger instance is used for logging.

- `getContract()`: This method returns the contract that this service interacts with. It could be used for debugging or extra interactions with the contract, but the main interactions are already added as the following methods.

- `async setBetValue(betIndex: number, value: number)`: This method sets the value of a bet. It takes two parameters: the index of the bet and the value to set. It should be called right after receiving the `BetPlaced` event.

- `async voidBet(betIndex: number)`: This method voids a bet. It takes one parameter: the index of the bet. It could be used by an admin to void a bet, which could be necessary in extreme cases. It returns the bet wagers to the bettors.

- `async closeBet(betIndex: number)`: This method closes a bet. It takes one parameter: the index of the bet. It should be called when a TBD time pased after a bet was placed.

- `async calculateResultsAndDistributeWinnings(betIndex: number, value: number)`: This method calculates the results of a bet and distributes the winnings. It takes two parameters: the index of the bet and the value to distribute. It will be called by a cron job after the time `timestamp of bet placed + contractLength` has passed. TBD when the cron job will be run, probably each day at midnight.

### Contract Getter

The `ContractGetterBase` and `ContractGetter` classes exist solely to avoid having the contract loading code be too coupled with the `ContractService`.

### Contract Structure

For information about the contract structure, refer to the [Contract README](https://github.com/alwaysaugust/sigma-zero-contracts/blob/dev/README.md)

## About paths and importing

We use `@/` to import anything from `./src`.

The `@/` prefix is a common alias used in many projects to avoid relative paths like `../../../`. It's typically set to resolve to the `src` directory, or the root directory of your project, making imports much cleaner and easier to manage.

This is set up in the tsconfig.json file like so:

```
{
    "compilerOptions": {
        "baseUrl": "./src",
        "paths": {
        "@/*": ["*"]
        }
    }
}
```

In this configuration, baseUrl is set to the base directory (`./src`), and a path is defined such that anything starting with `@/`` resolves to the baseUrl.

So, when you do `import { connectToDB } from '@/db';`, TypeScript will look for the db module in the src directory.
