import { useState } from "react";

const OPTIONS = [
  "Medication Only",
  "Lifestyle Modification",
  "Hydration Therapy",
  "Further Testing Required",
];

const formatDateTime = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString();
};

export default function TreatmentTab() {
  const [list, setList] = useState([
    {
      id: 1,
      value: "Medication Only",
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      value: "Hydration Therapy",
      createdAt: new Date().toISOString(),
    },
  ]);

  const [selected, setSelected] = useState("");

  const add = () => {
    if (!selected) return;

    const exists = list.some(
      (item) => item.value.toLowerCase() === selected.toLowerCase()
    );

    if (exists) {
      setSelected("");
      return;
    }

    setList((prev) => [
      ...prev,
      {
        id: Date.now(),
        value: selected,
        createdAt: new Date().toISOString(),
      },
    ]);

    setSelected("");
  };

  const remove = (id) => {
    setList((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <div className="space-y-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Treatment</h2>
        <p className="text-sm text-gray-500">
          Manage selected treatment items.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Select Treatment</option>
            {OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button
            onClick={add}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
          No treatment added yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full min-w-[650px]">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  Treatment
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  Date Added
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {list.map((item, index) => (
                <tr
                  key={item.id}
                  className={
                    index !== list.length - 1 ? "border-b border-gray-200" : ""
                  }
                >
                  <td className="px-4 py-4 text-center text-sm text-gray-800">
                    {item.value}
                  </td>

                  <td className="px-4 py-4 text-center text-sm text-gray-500">
                    {formatDateTime(item.createdAt)}
                  </td>

                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => remove(item.id)}
                      className="text-sm font-semibold text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}