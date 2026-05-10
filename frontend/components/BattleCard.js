export default function BattleCard({
  battle,
  wallet,
  joinBattle,
  resolveBattle,
}) {
  const isMine =
    battle.player1.toLowerCase() === wallet.toLowerCase() ||
    battle.player2.toLowerCase() === wallet.toLowerCase();

  const iWon =
    battle.finished &&
    battle.winner.toLowerCase() === wallet.toLowerCase();

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold">
              Battle #{battle.id}
            </h2>

            {isMine && (
              <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-xl text-sm">
                Your Battle
              </span>
            )}
          </div>

          <p className="text-gray-400 mt-2">
            Stake: {battle.amount} ETH
          </p>
        </div>
      </div>

      <div className="space-y-2 text-gray-300 mb-6">
        <div>
          Player 1: {battle.player1.slice(0, 10)}...
        </div>

        <div>
          Player 2:{" "}
          {battle.player2 ===
          "0x0000000000000000000000000000000000000000"
            ? "Waiting..."
            : `${battle.player2.slice(0, 10)}...`}
        </div>

        {battle.finished && (
          <div
            className={`font-semibold ${
              iWon ? "text-green-400" : "text-red-400"
            }`}
          >
            {iWon ? "You won this battle" : "You lost this battle"}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {!battle.finished &&
          battle.player2 ===
            "0x0000000000000000000000000000000000000000" &&
          battle.player1.toLowerCase() !==
            wallet.toLowerCase() && (
            <button
              onClick={() => joinBattle(battle.id, battle.amount)}
              className="bg-yellow-500 hover:bg-yellow-600 px-5 py-3 rounded-2xl font-semibold"
            >
              Join Battle
            </button>
          )}

        {!battle.finished &&
          battle.player2 !==
            "0x0000000000000000000000000000000000000000" && (
            <button
              onClick={() => resolveBattle(battle.id)}
              className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-2xl font-semibold"
            >
              Resolve Battle
            </button>
          )}
      </div>
    </div>
  );
}