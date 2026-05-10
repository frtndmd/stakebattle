export default function Filters({
  tab,
  setTab,
  minStake,
  setMinStake,
  sort,
  setSort,
}) {
  return (
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
  );
}