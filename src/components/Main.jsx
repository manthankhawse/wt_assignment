import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Legend, Tooltip } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function Main() {
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  const [formData, setFormData] = useState({ category: "", month: "", description: "", amount: "" });
  const [selectedMonth, setSelectedMonth] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const months = [
    "January", "February", "March", "April", "May",
    "June", "July", "August", "September",
    "October", "November", "December"
  ];

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.category === "" || formData.month === "") return;
    setExpenses([...expenses, formData]);
    setFormData({ category: "", month: "", description: "", amount: "" });
  };

  const handleDelete = (index) => {
    const updatedExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(updatedExpenses);
  };

  useEffect(() => {
    const filtered = expenses.filter(exp => exp.month === selectedMonth);
    setFilteredData(filtered);
  }, [selectedMonth, expenses]);

  const chartData = {
    labels: ['Food and Drinks', 'Fees', 'Accomodation', 'Entertainment'],
    datasets: [
      {
        label: 'Expenses',
        data: ['Food and Drinks', 'Fees', 'Accomodation', 'Entertainment'].map(category =>
          filteredData
            .filter(exp => exp.category === category)
            .reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
        ),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <div className='flex flex-col items-center justify-center'>
        <h1 className='text-3xl font-bold'>Expense Tracker</h1>
        <p className='text-xl font-light'>Add Your Expense</p>
      </div>

      <div>
        <form onSubmit={handleSubmit} className='w-full p-5 flex flex-col gap-5 items-center'>
          <div className='flex justify-center gap-5 w-full '>
            <input
              className='w-1/3 h-9 text-lg px-4 py-2 rounded-md shadow-lg inline-block border-2 border-grey-500'
              type='text'
              placeholder='Description'
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
            <input
              className='w-1/3 h-9 text-lg px-4 py-2 rounded-md shadow-lg inline-block border-2 border-grey-500'
              type='number'
              placeholder='Amount'
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>
          <select
            value={formData.month}
            onChange={(e) => setFormData({ ...formData, month: e.target.value })}
            required
            className='px-4 py-2 rounded-xl bg-blue-400 text-white font-semibold shadow-xl w-4/12 text-center'
          >
            <option value="">--Select Month--</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
            className='px-4 py-2 rounded-xl bg-blue-400 text-white font-semibold shadow-xl w-4/12 text-center'
          >
            <option value="">--Choose a Category--</option>
            <option value="Food and Drinks">Food and Drinks</option>
            <option value="Fees">Fees</option>
            <option value="Accomodation">Accomodation</option>
            <option value="Entertainment">Entertainment</option>
          </select>
          <button type='submit' className='bg-red-500 px-4 py-2 rounded-lg shadow-md text-white font-semibold'>Add Expense</button>
        </form>
      </div>

      <div className='flex w-full h-3/6'>
        <div className='w-full flex flex-col items-center'>
          <h1 className='text-lg font-semibold'>Expenses</h1>
          <div className='flex flex-col gap-2 w-11/12 overflow-y-auto'>
            {expenses.map((expense, index) => (
              <div key={index} className='bg-zinc-200 shadow-md rounded-lg px-5 py-3 flex justify-between items-center'>
                <div>
                  <div>{expense.description}</div>
                  <div className='text-xl font-semibold'>Rs. {expense.amount}</div>
                  <div>{expense.category} || {expense.month}</div>
                </div>
                <button
                  onClick={() => handleDelete(index)}
                  className='bg-red-500 text-white px-4 py-2 rounded-lg shadow-md'
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className='flex flex-col items-center w-5/12'>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className='px-4 py-2 rounded-lg font-semibold text-black bg-white border shadow-sm outline-none appearance-none focus:border-blue-600'
          >
            <option value="">--Select Month for Graph--</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          {selectedMonth && <Pie data={chartData} />}
        </div>
      </div>
    </>
  );
}

export default Main;
