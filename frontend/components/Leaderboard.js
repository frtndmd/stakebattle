export default function Leaderboard({ leaderboard }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">🏆 Leaderboard</h2>

        <div className="text-sm text-gray-400">
          Top players by wins
        </div>
      </div>

      <div className="space-y-4">
        {leaderboard.length === 0 && (
          <div className="text-gray-400">
            No completed battles yet.
          </div>
        )}

        {leaderboard.map((player, index) => (
          <div
            key={player.address}
            className="bg-black border border-zinc-800 rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-yellow-400">
                #{index + 1}
              </div>

              <div>
                <div className="font-semibold">
                  {player.address.slice(0, 8)}...
                  {player.address.slice(-4)}
                </div>

                <div className="text-gray-400 text-sm">
                  {player.wins} wins
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-green-400 font-bold text-lg">
                {player.earned.toFixed(4)} ETH
              </div>

              <div className="text-gray-500 text-sm">
                Total earned
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}