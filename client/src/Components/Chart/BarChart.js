import React from 'react';
import Chart from 'react-apexcharts';

const BarChart = ({ products }) => {
    const sortedProducts = products.sort((a, b) => b.stock - a.stock);
    const topThreeProducts = sortedProducts.slice(0, 3);
    const productNames = topThreeProducts.map(product => product.product_name);
    const inventoryLevels = topThreeProducts.map(product => product.stock);

    const chartOptions = {
        chart: {
            type: 'bar',
            height: 350,
        },
        xaxis: {
            categories: productNames,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded',
            },
        },
        dataLabels: {
            enabled: true,
        },
        colors: ['#1A56DB'], // Customize your bar color
    };

    const series = [{
        name: 'Stock',
        data: inventoryLevels,
    }];

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">TOP DE PRODUCTOS INVENTARIO (STOCK ACTUAL) </h2>
            <Chart options={chartOptions} series={series} type="bar" height={350} />
        </div>
    );
};

export default BarChart;