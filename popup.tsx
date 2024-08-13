import "./style.css"

function IndexPopup() {
  return (
    <div className="w-96 text-slate-800">
      <header>
        <input
          type="text"
          placeholder="Type to start searching"
          className="w-full border-b border-slate-200 p-3 text-sm outline-none focus:border-b-slate-400"
        />
      </header>
      <main className="flex items-start">
        <ul className="p-1 h-52 w-1/3 border-r border-slate-200 overflow-auto shrink-0">
          <li>
            <button
              className="flex justify-between items-center px-2 py-1 hover:bg-slate-100 rounded-md w-full"
              type="button">
              <span>ADJ.</span>
              <span className="bg-slate-300 font-medium rounded-md text-xs px-1.5 py-0.5">
                52
              </span>
            </button>
          </li>
        </ul>
        <section
          aria-label="Details"
          className="grow divide-y divide-slate-200">
          <div className="p-1">
            <p>Type - Noun</p>
            <p>Definition - lorem</p>
          </div>
          <div className="p-1">
            <p>Collocations</p>
            <ul className="flex gap-1 flex-wrap mt-1">
              <li className="px-1.5 py-0.5 bg-slate-500 text-slate-200 rounded-md">
                general
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}

export default IndexPopup
