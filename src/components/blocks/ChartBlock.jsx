import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ChartBlock = ({ block, isSelected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [chartType, setChartType] = useState(block.content.type || 'bar');
  const [labels, setLabels] = useState(block.content.data?.labels?.join(', ') || '');
  const [data, setData] = useState(block.content.data?.datasets?.[0]?.data?.join(', ') || '');
  const [title, setTitle] = useState(block.content.data?.datasets?.[0]?.label || 'Data');
  
  const updateBlock = useStore((state) => state.updateBlock);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const labelsArray = labels.split(',').map(label => label.trim());
    const dataArray = data.split(',').map(value => parseFloat(value.trim()) || 0);
    
    const chartData = {
      type: chartType,
      data: {
        labels: labelsArray,
        datasets: [{
          label: title,
          data: dataArray,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      }
    };
    
    updateBlock(block.id, { content: chartData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setChartType(block.content.type || 'bar');
    setLabels(block.content.data?.labels?.join(', ') || '');
    setData(block.content.data?.datasets?.[0]?.data?.join(', ') || '');
    setTitle(block.content.data?.datasets?.[0]?.label || 'Data');
    setIsEditing(false);
  };

  const renderChart = () => {
    const chartData = {
      labels: block.content.data?.labels || [],
      datasets: block.content.data?.datasets || []
    };
    
    const options = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: chartData.datasets[0]?.label || 'Chart',
        },
      },
    };

    switch (block.content.type) {
      case 'line':
        return <Line data={chartData} options={options} />;
      case 'pie':
        return <Pie data={chartData} options={options} />;
      case 'doughnut':
        return <Doughnut data={chartData} options={options} />;
      case 'bar':
      default:
        return <Bar data={chartData} options={options} />;
    }
  };

  return (
    <div className={`p-4 rounded-md transition-all ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Chart Type</label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
              <option value="pie">Pie Chart</option>
              <option value="doughnut">Doughnut Chart</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Chart Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Chart Title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Labels (comma-separated)</label>
            <input
              type="text"
              value={labels}
              onChange={(e) => setLabels(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Red, Blue, Green"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Data Values (comma-separated)</label>
            <input
              type="text"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="10, 20, 30"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div onClick={handleEdit} className="cursor-pointer h-64">
          {renderChart()}
        </div>
      )}
    </div>
  );
};

export default ChartBlock;