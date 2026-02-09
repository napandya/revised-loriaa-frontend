import React, { useState } from 'react';
import { Download, Plus, Search } from 'lucide-react';
import * as XLSX from 'xlsx';

interface Transaction {
  id: string;
  date: string;
  type: 'recharge' | 'usage';
  amount: number;
  description: string;
  balance: number;
}

const Billing: React.FC = () => {
  const [currentBalance] = useState(911);
  const [dateRange, setDateRange] = useState('Jan 20, 2023 - Feb 09, 2023');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      date: '2023-02-09',
      type: 'usage',
      amount: -15.50,
      description: 'API Calls - Voice Assistant',
      balance: 911
    },
    {
      id: '2',
      date: '2023-02-08',
      type: 'recharge',
      amount: 100,
      description: 'Account Recharge',
      balance: 926.50
    },
    {
      id: '3',
      date: '2023-02-05',
      type: 'usage',
      amount: -23.75,
      description: 'API Calls - Chat Bot',
      balance: 826.50
    },
    {
      id: '4',
      date: '2023-02-01',
      type: 'usage',
      amount: -12.25,
      description: 'API Calls - Voice Assistant',
      balance: 850.25
    },
    {
      id: '5',
      date: '2023-01-28',
      type: 'recharge',
      amount: 200,
      description: 'Account Recharge',
      balance: 862.50
    },
    {
      id: '6',
      date: '2023-01-25',
      type: 'usage',
      amount: -18.90,
      description: 'API Calls - Voice Assistant',
      balance: 662.50
    },
    {
      id: '7',
      date: '2023-01-22',
      type: 'usage',
      amount: -31.40,
      description: 'API Calls - Chat Bot',
      balance: 681.40
    },
    {
      id: '8',
      date: '2023-01-20',
      type: 'recharge',
      amount: 150,
      description: 'Account Recharge',
      balance: 712.80
    }
  ]);

  const filteredTransactions = transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportCSV = () => {
    const exportData = filteredTransactions.map(t => ({
      Date: new Date(t.date).toLocaleDateString(),
      Type: t.type.charAt(0).toUpperCase() + t.type.slice(1),
      Amount: `$${Math.abs(t.amount).toFixed(2)}`,
      Description: t.description,
      Balance: `$${t.balance.toFixed(2)}`
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    XLSX.writeFile(wb, `billing_history_${Date.now()}.xlsx`);
  };

  const handleAddFunds = () => {
    // This would open a modal or redirect to payment page
    alert('Add funds functionality would open here');
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Billing and Usage</h1>

      {/* Billing Information Card */}
      <div className="bg-gradient-to-br from-[#1a1f3a] to-[#0f1425] rounded-2xl p-8 mb-6 border border-gray-800">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-semibold text-white">Billing Information</h2>
          <div className="flex gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-[#0f1425] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
            >
              <option>Jan 20, 2023 - Feb 09, 2023</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 bg-[#0f1425] text-white px-4 py-2 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors"
            >
              <Download size={18} />
              Export CSV
            </button>
          </div>
        </div>

        <div>
          <p className="text-gray-400 text-sm mb-2">Current Balance</p>
          <p className="text-4xl font-bold text-white mb-4">${currentBalance}</p>
          <button
            onClick={handleAddFunds}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-lg font-medium transition-all"
          >
            <Plus size={18} />
            Add funds
          </button>
        </div>
      </div>

      {/* Recharge History Card */}
      <div className="bg-gradient-to-br from-[#1a1f3a] to-[#0f1425] rounded-2xl p-8 border border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Recharge History</h2>
          <button className="text-purple-400 hover:text-purple-300 transition-colors">
            →
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0f1425] text-white pl-12 pr-4 py-3 rounded-lg border border-gray-800 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Transaction History Table */}
        {filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-gray-400 font-medium pb-4 px-4">Date</th>
                  <th className="text-left text-gray-400 font-medium pb-4 px-4">Type</th>
                  <th className="text-left text-gray-400 font-medium pb-4 px-4">Amount</th>
                  <th className="text-left text-gray-400 font-medium pb-4 px-4">Description</th>
                  <th className="text-right text-gray-400 font-medium pb-4 px-4">Balance</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-800/50 hover:bg-[#0f1425]/50 transition-colors">
                    <td className="py-4 px-4 text-gray-300">
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        transaction.type === 'recharge'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </span>
                    </td>
                    <td className={`py-4 px-4 font-medium ${
                      transaction.amount > 0 ? 'text-green-400' : 'text-gray-300'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-gray-300">{transaction.description}</td>
                    <td className="py-4 px-4 text-right text-white font-medium">
                      ${transaction.balance.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
              <svg className="w-12 h-12 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-400">No data to be displayed here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Billing;
