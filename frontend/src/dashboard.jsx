import Navbar from "./navbar";
import {Legend, Tooltip, ResponsiveContainer, LineChart,Line, XAxis, YAxis } from 'recharts'; 
import { useEffect, useState } from 'react';
import axios  from "axios";

import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
//import { LineChart } from '@mui/x-charts/LineChart';

//const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];//, '#FF8042'
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import * as React from 'react';
  
const ViewDashboard =() => {
    const [data, setData] = useState([]);
    const [timeSpentData, setTimeSpentData] = useState([]);
    //const [timeSpentData3D, setTimeSpentData3D] = useState([]);
    const [LeaderboardData, setLeaderboardData] = useState([]);
    const [itemCount, setItemCount] = React.useState(20);


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch data for pie chart
                const response1 = await axios.get('http://127.0.0.1:8000/dashboardapi/addpoints', {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${localStorage.getItem('token')}`
                    },
                });
                const pieData = [
          {id: 0, value: response1.data.reduce((total, item) => total + item.DocumentsViewed, 0), label: 'DocumentsViewed',color:'#4E79A7'},
          {id: 1, value: response1.data.reduce((total, item) => total + item.DocumentsDownloaded, 0), label: 'DocumentsDownloaded',color:'#F28E2B'},
          {id: 2, value: response1.data.reduce((total, item) => total + item.DocumentsAdded, 0), label: 'DocumentsAdded',color:'#E15759'}
                  ];
                  setData(pieData);

                // Fetch data for line chart
                const response2 = await axios.get('http://127.0.0.1:8000/dashboardapi/timeSpent', {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${localStorage.getItem('token')}`
                    },
                });
                setTimeSpentData(response2.data);
        
                const response3 = await axios.get('http://127.0.0.1:8000/dashboardapi/leaderboard', {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${localStorage.getItem('token')}`
                    },
                });
                if (response3.data && Array.isArray(response3.data)) {
                    setLeaderboardData(response3.data.map(item => ({
                        username: item.user__username,
                        total_points: item.total_points
                    })));

                } else {
                    console.error("Leaderboard data is not an array");
                }
                
            } catch(error) {
                console.error("Error fetching data ", error);
            }
       
          
           
        };
        fetchData();
    }, []);
 

    const barHeight = 40; 
    const maxHeight = 800;
    const chartHeight = Math.min(LeaderboardData.length * barHeight, maxHeight);
const chartSetting = {
    xAxis: [
      {
        label: 'total points',
      },
    ],
    width: 690,
    height: chartHeight,
  };
const valueFormatter = (value) => `${value} points`;
return (
    <>
        <Navbar />
        <div style={{backgroundColor:'white   ', display: 'flex', 
        flexDirection: 'row',padding:'40px'}}>
        <div style={{flex: '1',  marginTop:'10px',borderRadius: '2px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',marginRight:'20px',backgroundColor:'white'}}> 
            <h1 style={{ textAlign: 'center' ,marginTop:'30px'}}>Leaderboard</h1>
            <div style={{marginLeft: '40px',  paddingLeft:'20px' }}>
            <BarChart
    dataset={LeaderboardData.slice(0, itemCount)}
    yAxis={[
        { 
            scaleType: 'band', 
            dataKey: 'username',
            tick: { fontSize: '14px', width: 100 } 
            
        }
    ]}
    margin={{ top: 75, right: 30, left: 100, bottom: 5 }}
    series={[{ dataKey: 'total_points', label: 'Total Points', valueFormatter }]}
    layout="horizontal"
    {...chartSetting}
/>
  <Typography id="item-count-slider" gutterBottom>
    Number of users
</Typography>
<Slider
    value={itemCount}
    onChange={(event, newValue) => setItemCount(newValue)}
    valueLabelDisplay="auto"
    min={1}
    max={20}
    aria-labelledby="item-count-slider"
    sx={{
        width: '90%',
        color: '#76B7B2',
    }}
/>
            </div>
  

        </div>        

        <div style={{flex: '1', 
      
        marginTop:'10px'}}>
            <div style={{flex: '1', borderRadius: '2px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        marginTop:'0px',width:'70%', marginLeft:'100px',backgroundColor:'white'}}>
           <ResponsiveContainer width="80%" height={300}>
            <PieChart 
                series={[
                    {
                        data,
                        highlightScope: { faded: 'global',
                         highlighted: 'item' },
                        faded: { innerRadius: 30, 
                            additionalRadius: -30, color: 'gray' },
                    },
                ]}
                margin={{ top: 15, right: 250, left: 20, bottom: 5}}
                height={300}
                width={400} 
                
            />     
            </ResponsiveContainer>
</div>
            <div style={{marginTop: '50px', borderRadius: '2px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',backgroundColor:'white',
      padding:'10px'}}>
                <h2 style={{ textAlign: 'center',marginTop:'10px' 
            }}>Time Spent Per Documents</h2>
                <ResponsiveContainer width="100%" height={450}>
                    <LineChart
                        width={500}
                        height={500}
                        data={timeSpentData}
                        margin={{ top: 0, right: 50, left: 0, bottom: 7 }}
                    >
                        
                        <XAxis dataKey="document_title" tick={{ angle: 0, textAnchor: 'middle' }} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="total_time" stroke="#4E79A7" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
    </>
    );
};
export default ViewDashboard;
/*
<CartesianGrid strokeDasharray="3 3" />
<div className="time-spent-chart" style={{ position: 'absolute', top: '180%', left: '80%', transform: 'translate(-50%, -50%)', border:'1px solid black' }}>
<h2 style={{ textAlign: 'center' }}>Time Spent Per Documents</h2>
    {timeSpentData3D && Array.isArray(timeSpentData3D.time_spent) ? (
        <Canvas style={{ width: '600px', height: '400px' }}>
            <ambientLight />
            <pointLight position={[10, 10, 10] }/>
            {timeSpentData3D.time_spent.map((row, i) =>
                Array.isArray(row) && row.map((value, j) => (
                    typeof value === 'number' && (
                        <Box key={`${i}-${j}`} position={[i - row.length / 2, value / 2, j - row.length / 2]} args={[1, value, 1]}>
                            <meshStandardMaterial color={'orange'} />
                        </Box>
                    )
                ))
            )}
        </Canvas>
    ) : (
        <div>Loading...</div>
    )}
</div>*/
/* <div className="right-column" style={{ flex: 1 ,marginTop:'30px'}}>
        <BarChart width={500} height={300} data={data}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="UserId" />
        <YAxis />
        <Tooltip />
            <Bar dataKey="DocumentsViewed" fill="#8884d8" />
            <Bar dataKey="DocumentsDownloaded" fill="#82ca9d" />
            <Bar dataKey="DocumentsAdded" fill="#ffc658" />
    </BarChart>
        </div>
        
        
         const response4 = await axios.get('http://127.0.0.1:8000/dashboardapi/timeSpent3d', {
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`
    },
            });
            console.log("Response data:", response4.data);
        setTimeSpentData3D(response4.data);*/