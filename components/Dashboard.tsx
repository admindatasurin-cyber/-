import React, { useMemo, useState } from 'react';
import { Refugee } from '../types';
import { generateSituationReport } from '../services/geminiService';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Wand2, Loader2, AlertTriangle, Users, HeartPulse } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface DashboardProps {
  data: Refugee[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [report, setReport] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const stats = useMemo(() => {
    const total = data.length;
    const medicalCases = data.filter(r => r.medicalNeeds && r.medicalNeeds !== 'ไม่มี' && r.medicalNeeds !== 'None').length;
    
    // Process Shelter Distribution
    const shelterMap: Record<string, number> = {};
    data.forEach(r => {
      const name = r.shelterName || 'ไม่ระบุ';
      shelterMap[name] = (shelterMap[name] || 0) + 1;
    });
    const shelterData = Object.keys(shelterMap).map(key => ({ name: key, value: shelterMap[key] }));

    // Process Gender
    const genderMap: Record<string, number> = {};
    data.forEach(r => {
      genderMap[r.gender] = (genderMap[r.gender] || 0) + 1;
    });
    const genderData = Object.keys(genderMap).map(key => ({ name: key, value: genderMap[key] }));

    return { total, medicalCases, shelterData, genderData };
  }, [data]);

  const handleGenerateReport = async () => {
    setGenerating(true);
    const result = await generateSituationReport(data);
    setReport(result);
    setGenerating(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0">
               <Users className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">ยอดผู้อพยพทั้งหมด</dt>
                <dd className="text-3xl font-bold text-gray-900">{stats.total}</dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5 flex items-center">
             <div className="flex-shrink-0">
               <HeartPulse className="h-6 w-6 text-red-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">ต้องการแพทย์เร่งด่วน</dt>
                <dd className="text-3xl font-bold text-red-600">{stats.medicalCases}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5 flex items-center">
             <div className="flex-shrink-0">
               <AlertTriangle className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">อัตราส่วนผู้ป่วยวิกฤต</dt>
                <dd className="text-3xl font-bold text-gray-900">
                  {stats.total > 0 ? ((stats.medicalCases / stats.total) * 100).toFixed(1) : 0}%
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">จำนวนผู้อพยพแต่ละศูนย์พักพิง</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.shelterData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">สัดส่วนเพศ</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.genderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow p-6 border border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-indigo-600" />
            การวิเคราะห์สถานการณ์ด้วย AI
          </h3>
          <button
            onClick={handleGenerateReport}
            disabled={generating}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {generating ? <Loader2 className="animate-spin h-4 w-4 mr-2"/> : null}
            {generating ? 'กำลังวิเคราะห์...' : 'สร้างรายงาน'}
          </button>
        </div>
        
        {report ? (
          <div className="prose prose-blue max-w-none bg-white p-6 rounded-md shadow-sm">
            <ReactMarkdown>{report}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">
            คลิก "สร้างรายงาน" เพื่อให้ Gemini AI วิเคราะห์ข้อมูลและสรุปความต้องการรวมถึงข้อเสนอแนะในการจัดสรรทรัพยากร
          </p>
        )}
      </div>
    </div>
  );
};