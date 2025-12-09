import React, { useMemo, useState } from 'react';
import { Refugee } from '../types';
import { Search, Filter } from 'lucide-react';

interface RefugeeListProps {
  data: Refugee[];
}

export const RefugeeList: React.FC<RefugeeListProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShelter, setSelectedShelter] = useState('all');

  // Extract unique shelters for the filter dropdown
  const uniqueShelters = useMemo(() => {
    const shelters = new Set(data.map(d => d.shelterName).filter(Boolean));
    return Array.from(shelters).sort();
  }, [data]);

  const filteredData = data.filter(r => {
    const matchesSearch = 
      r.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.shelterName && r.shelterName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesShelter = selectedShelter === 'all' || r.shelterName === selectedShelter;

    return matchesSearch && matchesShelter;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 gap-4">
        <h2 className="text-2xl font-bold text-gray-900">รายชื่อผู้อพยพที่ลงทะเบียนแล้ว</h2>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Shelter Filter Dropdown */}
          <div className="relative rounded-md shadow-sm w-full sm:w-48">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
             </div>
             <select
                value={selectedShelter}
                onChange={(e) => setSelectedShelter(e.target.value)}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-9 sm:text-sm border-gray-300 rounded-md p-2 border bg-white"
             >
                <option value="all">ทุกศูนย์พักพิง</option>
                {uniqueShelters.map((shelter) => (
                  <option key={shelter} value={shelter}>{shelter}</option>
                ))}
             </select>
          </div>

          {/* Search Box */}
          <div className="relative rounded-md shadow-sm w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border"
              placeholder="ค้นหาชื่อ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ-สกุล</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ศูนย์พักพิง</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เบอร์โทร</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">อายุ/เพศ</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ครอบครัว</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ความต้องการทางการแพทย์</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((person, idx) => (
                    <tr key={person.id || idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{person.firstName} {person.lastName}</div>
                        <div className="text-xs text-gray-500">วันที่: {person.registrationDate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {person.shelterName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {person.phoneNumber || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {person.age} / {person.gender}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {person.familySize} คน
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${person.medicalNeeds && person.medicalNeeds !== 'ไม่มี' && person.medicalNeeds !== 'None' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {person.medicalNeeds?.substring(0, 20) || 'ไม่มี'}{person.medicalNeeds && person.medicalNeeds.length > 20 ? '...' : ''}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${person.status === 'ดำเนินการแล้ว' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                           {person.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500">
                        ไม่พบข้อมูลที่ตรงกับการค้นหา หรือไม่มีข้อมูลในศูนย์พักพิงที่เลือก
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};