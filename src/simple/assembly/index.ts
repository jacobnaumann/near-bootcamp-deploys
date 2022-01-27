import { storage, Context, logging, PersistentMap, u128 } from "near-sdk-as"

const balances = new PersistentMap<string, u64>("b:");

// return the string 'hello world'
export function helloWorld(): string {
  return 'hello world'
}

// read the given key from account (contract) storage
export function read(key: string): string {
  if (storage.hasKey(key)) {
    return `✅ Key [ ${key} ] has value [ ${storage.getString(key)!} ]`
  } else {
    return `🚫 Key [ ${key} ] not found in storage. ( ${storageReport()} )`
  }
}

// write the given value at the given key to account (contract) storage
export function write(key: string, value: string): string {
  storage.set(key, value)
  return `✅ Data saved. ( ${storageReport()} )`
}

// private helper method used by read() and write() above
function storageReport(): string {
  return `storage [ ${Context.storageUsage} bytes ]`
}

// function randomNum(): u32 {
//   let buf = math.randomBuffer(4);
//   return (
//     (((0xff & buf[0]) << 24) |
//       ((0xff & buf[1]) << 16) |
//       ((0xff & buf[2]) << 8) |
//       ((0xff & buf[3]) << 0)) %
//     100
//   );
// }

export function get_block(): u64 {
  return Context.blockIndex
}

export function get_balance(): u128 {
  return Context.accountBalance
}

export function transfer(to: string, tokens: u64): boolean {
  logging.log("transfer from: " + Context.sender + " to: " + to + " tokens: " + tokens.toString());
  const fromAmount = getBalance(Context.sender);
  assert(fromAmount >= tokens, "not enough tokens on account");
  assert(getBalance(to) <= getBalance(to) + tokens,"overflow at the receiver side");
  balances.set(Context.sender, fromAmount - tokens);
  balances.set(to, getBalance(to) + tokens);
  return true;
}

function getBalance(owner: string): u64 {
  return balances.contains(owner) ? balances.getSome(owner) : 0;
}
