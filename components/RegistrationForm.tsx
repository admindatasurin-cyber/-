import React, { useState } from 'react';
import { Refugee } from '../types';
import { submitRefugee } from '../services/sheetService';
import { CheckCircle, AlertCircle, Loader2, Plus, Trash2, User } from 'lucide-react';

type RefugeeEntry = Omit<Refugee, 'id' | 'registrationDate' | 'status'>;

const INITIAL_ENTRY: RefugeeEntry = {
  firstName: '',
  lastName: '',
  age: 0,
  gender: 'ชาย',
  phoneNumber: '',
  shelterName: '',
  familySize: 1,
  medicalNeeds: 'ไม่มี',
};

export const RegistrationForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State now holds an array of entries
  const [entries, setEntries] = useState<RefugeeEntry[]>([{ ...INITIAL_ENTRY }]);

  const handleAddEntry = () => {
    if (entries.length < 5) {
      // Auto-fill shelter name and phone from the first entry for convenience
      const firstEntry = entries[0];
      setEntries([
        ...entries, 
        { 
          ...INITIAL_ENTRY,
          shelterName: firstEntry.shelterName, // Copy shelter
          phoneNumber: firstEntry.phoneNumber // Copy phone
        }
      ]);
    }
  };

  const handleRemoveEntry = (index: number) => {
    const newEntries = [...entries];
    newEntries.splice(index, 1);
    setEntries(newEntries);
  };

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newEntries = [...entries];
    newEntries[index] = {
      ...newEntries[index],
      [name]: name === 'age' || name === 'familySize' ? parseInt(value) || 0 : value
    };
    setEntries(newEntries);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let successCount = 0;
      let lastError = "";
      const today = new Date().toISOString().split('T')[0];

      // Process submissions sequentially
      for (const entry of entries) {
        const payload = {
          ...entry,
          registrationDate: today,
          status: 'รอดำเนินการ',
        };
        
        const result = await submitRefugee(payload);
        if (result.success) {
          successCount++;
        } else {
          lastError = result.error || "Unknown error";
        }
      }
      
      if (successCount === entries.length) {
        setSuccess(true);
        // Reset to single empty form
        setEntries([{ ...INITIAL_ENTRY }]);
        // Scroll to top
        window.scrollTo(0, 0);
      } else {
        setError(`บันทึกสำเร็จ ${successCount} จาก ${entries.length} คน (${lastError}) กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตหรือการตั้งค่า Script`);
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดที่ไม่คาดคิด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="bg-blue-600 rounded-xl shadow-lg p-6 text-white">
          <h2 className="text-xl font-bold">ลงทะเบียนผู้อพยพแบบกลุ่ม</h2>
          <p className="text-blue-100 text-sm mt-1">
            สามารถกรอกข้อมูลได้สูงสุด 5 คนในครั้งเดียว (เหมาะสำหรับครอบครัว)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {success && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md shadow-sm">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    ลงทะเบียนสำเร็จครบถ้วน ข้อมูลถูกบันทึกแล้ว
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {error && (
             <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md shadow-sm">
               <div className="flex">
                 <AlertCircle className="h-5 w-5 text-red-400" />
                 <div className="ml-3">
                   <p className="text-sm font-medium text-red-800">{error}</p>
                 </div>
               </div>
             </div>
          )}

          {entries.map((entry, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg">
              <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 p-1.5 rounded-full">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-700">คนที่ {index + 1}</h3>
                </div>
                {entries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveEntry(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="ลบรายการนี้"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">ชื่อจริง</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={entry.firstName}
                    onChange={(e) => handleChange(index, e)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    placeholder="เช่น สมชาย"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">นามสกุล</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={entry.lastName}
                    onChange={(e) => handleChange(index, e)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    placeholder="เช่น ใจดี"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">อายุ</label>
                    <input
                      type="number"
                      name="age"
                      required
                      min="0"
                      value={entry.age}
                      onChange={(e) => handleChange(index, e)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">เพศ</label>
                    <select
                      name="gender"
                      value={entry.gender}
                      onChange={(e) => handleChange(index, e)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    >
                      <option value="ชาย">ชาย</option>
                      <option value="หญิง">หญิง</option>
                      <option value="อื่นๆ">อื่นๆ</option>
                    </select>
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700">สมาชิกในครอบครัว (คน)</label>
                   <input
                    type="number"
                    name="familySize"
                    required
                    min="1"
                    value={entry.familySize}
                    onChange={(e) => handleChange(index, e)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">เบอร์โทรศัพท์</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={entry.phoneNumber}
                    onChange={(e) => handleChange(index, e)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    placeholder="0xx-xxx-xxxx"
                  />
                </div>

                 <div>
                  <label className="block text-sm font-medium text-gray-700">ชื่อศูนย์พักพิง</label>
                  <input
                    type="text"
                    name="shelterName"
                    required
                    value={entry.shelterName}
                    onChange={(e) => handleChange(index, e)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    placeholder="เช่น บ้านแม่หละ"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">ความต้องการทางการแพทย์ / อาการวิกฤต</label>
                  <input
                    type="text"
                    name="medicalNeeds"
                    value={entry.medicalNeeds}
                    onChange={(e) => handleChange(index, e)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    placeholder="ระบุอาการบาดเจ็บ หรือโรคประจำตัว (ถ้าไม่มีให้ใส่ 'ไม่มี')"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
            <button
              type="button"
              onClick={handleAddEntry}
              disabled={entries.length >= 5}
              className={`flex items-center justify-center px-4 py-2 border border-dashed border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto ${entries.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Plus className="w-5 h-5 mr-2" />
              เพิ่มรายชื่อ ({entries.length}/5)
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  กำลังบันทึก {entries.length} รายการ...
                </>
              ) : (
                `บันทึกข้อมูลทั้งหมด (${entries.length})`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};