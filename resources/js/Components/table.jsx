import React from 'react';

const ShiftTable = ({ shifts, onAddShift }) => {
  const formatTime = (timeString) => {
    if (!timeString) return "-";
    return timeString.substring(0, 5);
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto font-caudex px-4 md:px-0">
      
      <div className="bg-[#D7F8FF] backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-10 shadow-xl border border-[#0C365B]">

        <div className="flex justify-end mb-4 md:mb-8">
          <div className="relative">
            <select 
              className="appearance-none bg-white border-2 border-[#255476] text-[#255476] py-1.5 md:py-2 pl-6 pr-10 md:pr-12 rounded-full text-sm md:text-base font-semibold focus:outline-none focus:border-cyan-600 shadow-sm cursor-pointer min-w-[200px] md:min-w-[400px]"
              defaultValue="default"
            >
              <option value="default" disabled>Sorted by</option>
              <option value="date">Date</option>
              <option value="kuota">Quota</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 md:px-4 text-cyan-900">
              <svg className="fill-current h-4 w-4 md:h-5 md:w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-sm border border-[#0C365B]">
          <table className="min-w-[900px] w-full text-center text-cyan-900">
            <thead className="bg-white/75 font-serif font-bold text-base md:text-xl tracking-wide">
              <tr>
                <th className="py-3 px-3 md:py-5 md:px-6 border-b border-r border-[#0C365B] w-16 md:w-24">No</th>
                <th className="py-3 px-3 md:py-5 md:px-6 border-b border-r border-[#0C365B]">Shift</th>
                <th className="py-3 px-3 md:py-5 md:px-6 border-b border-r border-[#0C365B]">Date</th>
                <th className="py-3 px-3 md:py-5 md:px-6 border-b border-r border-[#0C365B]">Time</th>
                <th className="py-3 px-3 md:py-5 md:px-6 border-b border-r border-[#0C365B]">Quota</th>
                <th className="py-3 px-3 md:py-5 md:px-6 border-b border-r border-[#0C365B] text-sm md:text-lg">Availability</th>
                <th className="py-3 px-3 md:py-5 md:px-6 border-b border-[#0C365B]">Action</th>
              </tr>
            </thead>

            <tbody className="bg-white/75 text-sm md:text-lg font-medium">
              {shifts.map((item, index) => (
                <tr key={item.id} className="hover:bg-white/50 transition-colors h-16 md:h-24">
                  <td className="border-b border-r border-[#0C365B]">{index + 1}</td>
                  <td className="border-b border-r border-[#0C365B]">{item.shift_no}</td>
                  <td className="border-b border-r border-[#0C365B]">{item.date}</td>
                  <td className="border-b border-r border-[#0C365B]">
                    {formatTime(item.time_start)} - {formatTime(item.time_end)}
                  </td>
                  <td className="border-b border-r border-[#0C365B]">{item.kuota}</td>
                  <td className="border-b border-r border-[#0C365B]">
                    {item.availability !== undefined ? item.availability : "-"}
                  </td>
                  <td className="border-b border-[#0C365B]">
                    <button 
                    onClick={() => onAddShift(item)}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-1.5 px-4 md:py-3 md:px-8 rounded-md md:rounded-lg shadow-md text-xs md:text-base transition-transform transform active:scale-95">
                      Add
                    </button>
                  </td>
                </tr>
              ))}
              
              {[...Array(Math.max(0, 3 - shifts.length))].map((_, i) => (
                <tr key={`empty-${i}`} className="h-16 md:h-24">
                  <td className="border-b border-r border-[#0C365B]">
                    {shifts.length + i + 1}
                  </td>
                  <td className="border-b border-r border-[#0C365B]"></td>
                  <td className="border-b border-r border-[#0C365B]"></td>
                  <td className="border-b border-r border-[#0C365B]"></td>
                  <td className="border-b border-r border-[#0C365B]"></td>
                  <td className="border-b border-r border-[#0C365B]"></td>
                  <td className="border-b border-[#0C365B]"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default ShiftTable;