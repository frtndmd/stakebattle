"use client";

import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import toast, { Toaster } from "react-hot-toast";

const contractAddress = "0xC2b88E7358a931f4A9B45a784d5Ec29CDA7048eA";

const abi = [
  "function createBattle() payable",
  "function joinBattle(uint256 battleId) payable",
  "function resolveBattle(uint256 battleId)",
  "function battleCount() view returns (uint256)",
  "function battles(uint256) view returns(address player1,address player2,uint256 amount,bool finished,address winner)",
];

export default function Home() {
  const [wallet, setWallet] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [battles, setBattles] = useState([]);
  const [tab, setTab] = useState("all");
  const [sort, setSort] = useState("newest");
  const [minStake, setMinStake] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);

  async function connectWallet() {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setWallet(accounts[0]);

      toast.success("Wallet connected");
    } catch {
      toast.error("Connection failed");
    }
  }

  async function getContract(readOnly = false) {
    const provider = new ethers.BrowserProvider(window.ethereum);

    if (readOnly) {
      return new ethers.Contract(contractAddress, abi, provider);
    }

    const signer = await provider.getSigner();

    return new ethers.Contract(contractAddress, abi, signer);
  }

  async function loadBattles() {
    try {
      const contract = await getContract(true);

      const count = await contract.battleCount();

      const loaded = [];

      for (let i = 0; i < Number(count); i++) {
        const battle = await contract.battles(i);

        loaded.push({
          id: i,
          player1: battle.player1,
          player2: battle.player2,
          amount: ethers.formatEther(battle.amount),
          finished: battle.finished,
          winner: battle.winner,
          createdAt: Date.now() - i * 100000,
        });
      }

      const stats = {};

      loaded.forEach((battle) => {
        if (!battle.finished) return;

        const winner = battle.winner.toLowerCase();

        if (!stats[winner]) {
          stats[winner] = {
            address: battle.winner,
            wins: 0,
            earned: 0,
          };
        }

        stats[winner].wins += 1;
        stats[winner].earned += parseFloat(battle.amount) * 2;
      });

      const sortedLeaderboard = Object.values(stats).sort(
        (a, b) => b.wins - a.wins
      );

      setLeaderboard(sortedLeaderboard);
      

      setBattles(loaded);
    } catch (err) {
      console.error(err);
    }
  }



  useEffect(() => {
    loadBattles();
  }, []);

  async function createBattle() {
    try {
      setLoading(true);

      const contract = await getContract();

      const tx = await contract.createBattle({
        value: ethers.parseEther(amount),
      });

      toast.loading("Creating battle...", { id: "tx" });

      await tx.wait();

      toast.success("Battle created!", { id: "tx" });

      setAmount("");

      await loadBattles();
    } catch (err) {
      console.error(err);
      toast.error("Transaction failed", { id: "tx" });
    } finally {
      setLoading(false);
    }
  }

  async function joinBattle(id, amount) {
    try {
      setLoading(true);

      const contract = await getContract();

      const tx = await contract.joinBattle(id, {
        value: ethers.parseEther(amount),
      });

      toast.loading("Joining battle...", { id: "tx" });

      await tx.wait();

      toast.success("Battle joined!", { id: "tx" });

      await loadBattles();
    } catch (err) {
      console.error(err);
      toast.error("Join failed", { id: "tx" });
    } finally {
      setLoading(false);
    }
  }

  async function resolveBattle(id) {
    try {
      setLoading(true);

      const contract = await getContract();

      const tx = await contract.resolveBattle(id);

      toast.loading("Resolving battle...", { id: "tx" });

      await tx.wait();

      toast.success("Battle resolved!", { id: "tx" });

      await loadBattles();
    } catch (err) {
      console.error(err);
      toast.error("Resolve failed", { id: "tx" });
    } finally {
      setLoading(false);
    }
  }

  const filteredBattles = useMemo(() => {
    let result = [...battles];

    if (tab === "active") {
      result = result.filter(
        (b) =>
          !b.finished &&
          (b.player1.toLowerCase() === wallet.toLowerCase() ||
            b.player2.toLowerCase() === wallet.toLowerCase())
      );
    }

    if (tab === "finished") {
      result = result.filter(
        (b) =>
          b.finished &&
          (b.player1.toLowerCase() === wallet.toLowerCase() ||
            b.player2.toLowerCase() === wallet.toLowerCase())
      );
    }

    if (minStake) {
      result = result.filter(
        (b) => parseFloat(b.amount) >= parseFloat(minStake)
      );
    }

    result.sort((a, b) => {
      if (sort === "newest") return b.id - a.id;
      return a.id - b.id;
    });

    return result;
  }, [battles, tab, wallet, minStake, sort]);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-5xl font-bold">⚔️ StakeBattle</h1>
            <p className="text-gray-400 mt-2">
              Blockchain PvP betting arena
            </p>
          </div>

          <button
            onClick={connectWallet}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-2xl font-semibold transition"
          >
            {wallet
              ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}`
              : "Connect Wallet"}
          </button>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-5">Create Battle</h2>

          <div className="flex gap-4">
            <input
              placeholder="ETH Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-black border border-zinc-700 rounded-2xl px-4 py-3 w-full"
            />

            <button
              onClick={createBattle}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-2xl font-semibold"
            >
              {loading ? "Loading..." : "Create"}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setTab("all")}
            className={`px-5 py-3 rounded-2xl ${
              tab === "all" ? "bg-white text-black" : "bg-zinc-900"
            }`}
          >
            All Battles
          </button>

          <button
            onClick={() => setTab("active")}
            className={`px-5 py-3 rounded-2xl ${
              tab === "active" ? "bg-white text-black" : "bg-zinc-900"
            }`}
          >
            My Active
          </button>

          <button
            onClick={() => setTab("finished")}
            className={`px-5 py-3 rounded-2xl ${
              tab === "finished" ? "bg-white text-black" : "bg-zinc-900"
            }`}
          >
            My Finished
          </button>

          <input
            placeholder="Min ETH"
            value={minStake}
            onChange={(e) => setMinStake(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3"
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

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
        <div className="grid gap-5">
          {filteredBattles.map((battle) => {
            const isMine =
              battle.player1.toLowerCase() === wallet.toLowerCase() ||
              battle.player2.toLowerCase() === wallet.toLowerCase();

            const iWon =
              battle.finished &&
              battle.winner.toLowerCase() === wallet.toLowerCase();

            return (
              <div
                key={battle.id}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"
              >
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

                  <div>
                    {battle.finished ? (
                      <span className="bg-red-500/20 text-red-400 px-4 py-2 rounded-2xl">
                        Finished
                      </span>
                    ) : battle.player2 !==
                      "0x0000000000000000000000000000000000000000" ? (
                      <span className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-2xl">
                        Ready
                      </span>
                    ) : (
                      <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-2xl">
                        Open
                      </span>
                    )}
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
                        onClick={() =>
                          joinBattle(battle.id, battle.amount)
                        }
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
          })}
        </div>
      </div>
    </main>
  );
}