import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import getBaseUrl from '../../utils/baseURl';
import Loading from '../../components/Loading';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenueChart = () => {
  const [monthlyData, setMonthlyData] = useState({
    labels: [],
    revenues: [],
    orders: []
  });

  useEffect(() => {
    const fetchMonthlyStats = async () => {
      try {
        const response = await axios.get(`${getBaseUrl()}/admin/`);
        const monthlySales = response.data.monthlySales;

        const processedData = monthlySales.reduce((acc, month) => {
          const date = new Date(month._id + '-01');
          const monthName = date.toLocaleString('default', { month: 'short' });
          
          acc.labels.push(monthName);
          acc.revenues.push(month.totalSales);
          acc.orders.push(month.totalOrders);
          return acc;
        }, { labels: [], revenues: [], orders: [] });

        setMonthlyData(processedData);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      }
    };

    fetchMonthlyStats();
  }, []);

  const data = {
    labels: monthlyData.labels,
    datasets: [
      {
        label: 'Revenue (₹)',
        data: monthlyData.revenues,
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        label: 'Orders',
        data: monthlyData.orders,
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
        yAxisID: 'y1',
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio:false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        padding:10,
      },
      title: {
        display: true,
        text: 'Monthly Revenue & Orders',
        font: {
          size: 16,
          weight:'bold'
        },
        padding:{
          top:10,
          bottom:20
        }
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Revenue (₹)',
          padding:{
            top:0,
            bottom:10
          }
        },
        beginsAtZero:true
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Number of Orders',
          padding:{
            top:0,
            bottom:10
          }
        },
        beginsAtZero:true,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    layout:{
      padding:{
        top:10,
        right:10,
        bottom:10,
        left:15
      }
    }
  };




  return (
    <div className="w-full max-w-3xl mx-auto h-full">
      <div className='h-[calc(100%-2rem)] min-h-[400px]'>
        {monthlyData.labels.length > 0 ? (
          <Bar data={data} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Loading/>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;