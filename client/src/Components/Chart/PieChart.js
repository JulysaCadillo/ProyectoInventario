import React from 'react';
import Chart from 'react-apexcharts';

const PieChart = ({ orders }) => {
    // Step 1: Get top three orders by quantity
    const topThreeOrders = orders
        .sort((a, b) => b.quantity - a.quantity) // Sort by quantity in descending order
        .slice(0, 3); // Get top three

    // Step 2: Prepare data for the chart
    const labels = topThreeOrders.map(order => order.product_name);
    const series = topThreeOrders.map(order => order.quantity);

    const chartOptions = {
        chart: {
            type: 'donut',
            height: 350,
        },
        tooltip: {
            y: {
                formatter: (val, { seriesIndex }) => {
                    const order = topThreeOrders[seriesIndex];
                    return `Ordenes: ${order.order_id}, Cantidad: ${val}`;
                },
            },
        },
        labels: labels,
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                width: 200
                },
                legend: {
                position: 'bottom'
                }
            }
        }],
        plotOptions: {
            pie: {
                donut: {
                    size: '55%',
                },
            },
        },
        dataLabels: {
            enabled: true,
        },
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">TOP DE ORDENES (CANTIDAD DE ORDERNES)</h2>
            <Chart options={chartOptions} series={series} type="donut" height={350} />
        </div>
    );
};

export default PieChart;