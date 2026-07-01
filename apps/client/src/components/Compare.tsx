import React from 'react';
import { Scale, AlertCircle } from 'lucide-react';
import { useCars } from '../contexts/CarContext';
import { formatCurrency } from './Overview';

export const Compare: React.FC = () => {
  const {
    selectedForCompare,
    handleToggleSelectCompare,
    compareData,
    triggerComparisonFetch
  } = useCars();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
        <Scale className="h-6 w-6 text-brand-600" />
        <span>Vehicle Comparison Grid</span>
      </h2>

      {selectedForCompare.length === 0 ? (
        <div className="glass-panel p-12 text-center space-y-3">
          <AlertCircle className="h-10 w-10 text-brand-600 mx-auto" />
          <h4 className="font-bold text-slate-800">No vehicles selected for comparison</h4>
          <p className="text-sm text-slate-500">
            Go to the catalog and click the scale icon on up to 4 cars.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active selections list */}
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-xs text-slate-500">Selected ({selectedForCompare.length}/4):</span>
            {selectedForCompare.map((car) => (
              <span
                key={car._id}
                className="inline-flex items-center space-x-1.5 bg-slate-100 border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800"
              >
                <span>
                  {car.make} {car.model} ({car.variant})
                </span>
                <button
                  onClick={() => handleToggleSelectCompare(car)}
                  className="text-slate-400 hover:text-red-500 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
            <button
              onClick={triggerComparisonFetch}
              className="px-4 py-1.5 rounded bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs ml-auto shadow-sm"
            >
              Compare Specifications
            </button>
          </div>

          {/* Spec Table */}
          {compareData ? (
            <div className="glass-panel overflow-x-auto">
              <table className="w-full min-w-[700px] text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-4 font-bold text-slate-500 w-1/4">Specification</th>
                    {compareData.vehicles.map((car: any, idx: number) => (
                      <th
                        key={car._id}
                        className="p-4 font-extrabold text-slate-800 w-1/4 border-l border-slate-100"
                      >
                        <div className="space-y-1">
                          <span className="block text-[10px] text-brand-600 font-bold uppercase tracking-wide">
                            Vehicle {idx + 1}
                          </span>
                          <span className="block">{car.make} {car.model}</span>
                          <span className="block font-normal text-slate-500 text-[10px]">
                            {car.variant}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compareData.comparisonTable.map((row: any, rIdx: number) => (
                    <tr
                      key={row.key}
                      className={`border-b border-slate-100 ${
                        rIdx % 2 === 0 ? 'bg-slate-50/30' : 'bg-transparent'
                      }`}
                    >
                      <td className="p-4 font-semibold text-slate-650">{row.label}</td>
                      <td className="p-4 text-slate-700 border-l border-slate-100">
                        {row.key === 'price' ? formatCurrency(row.car1) : row.car1}
                      </td>
                      {compareData.vehicles.length >= 2 && (
                        <td className="p-4 text-slate-700 border-l border-slate-100">
                          {row.key === 'price' ? formatCurrency(row.car2) : row.car2}
                        </td>
                      )}
                      {compareData.vehicles.length >= 3 && (
                        <td className="p-4 text-slate-700 border-l border-slate-100">
                          {row.key === 'price' ? formatCurrency(row.car3) : row.car3}
                        </td>
                      )}
                      {compareData.vehicles.length >= 4 && (
                        <td className="p-4 text-slate-700 border-l border-slate-100">
                          {row.key === 'price' ? formatCurrency(row.car4) : row.car4}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-550 bg-slate-50 rounded-lg border border-slate-200 border-dashed text-xs">
              Click the "Compare Specifications" button above to view specs details side-by-side.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
