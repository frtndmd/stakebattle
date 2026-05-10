export default function Header({ wallet, connectWallet }) {
  return (
    <div className="flex items-center justify-between mb-10">
      <div>
        <h1 className="text-5xl font-bold">⚔️ StakeBattle</h1>

        <p className="text-gray-400 mt-2">
          Blockchain PvP betting arena
        </p>
      </div>

      <button
        onClick={connectWallet}
        className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-2xl font-semibold"
      >
        {wallet
          ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}`
          : "Connect Wallet"}
      </button>
    </div>
  );
}