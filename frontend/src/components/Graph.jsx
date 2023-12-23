import React, { useEffect, useState } from 'react'
import Chart from 'chart.js/auto'
import { Bar } from 'react-chartjs-2';

export default function Graph(props) {            

    let {optionStats} = props

    const labels = ["A","B","C","D"]

    const [chartData, setChartData] = useState({
        labels: labels, 
        datasets: [
            {
                label: "Number of student ",
                // data: [0, 0, 0, 0, 1, 1, 0, 0, 2, 0],
                data: [],
                backgroundColor: [
                    "#228b22",
                    "#ba0202",
                    "#366fda",
                    "#f19f06",
                    "#2a71d0",
                    "#2a7vsd",
                    "#2a775d",
                    "#5a775d",
                    "#4a775d",
                    "#6a775d",
                ],
                borderColor: "black",
                borderWidth: 2
            }
        ]
    });        

    const setData = async() => {

        let temp = optionStats.map((optionStat) => {
            return Number(optionStat)
        })
        
        console.log(temp)
        setChartData({
            labels: labels, 
            datasets: [
                {
                    label: "Number of student ",
                    // data: [5, 4, 3, 10, 1, 1, 7, 9, 2, 8],
                    data: temp,
                    backgroundColor: ["#228b22","#ba0202","#366fda","#f19f06",,"#2a71d0","#2a7vsd","#2a775d","#5a775d","#4a775d","#6a775d",],
                    borderColor: "black",
                    borderWidth: 2
                }
            ]
        })
    }    

    useEffect(() => {

        setData()

    },[])    

    return (
        <div>
            <div className='container'>
                <div className='content'>
                    {                                                
                        <div>
                            {/* <h1>Hello from Analysis.</h1> */}
                            <div className="chart-container">
                            {/* <h2 style={{ textAlign: "center" }}>Bar Chart</h2> */}
                            <div style={{height:"250px"}}>
                                <Bar
                                    data={chartData}
                                    options={{                                                                                
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: "Options selection of users"
                                            },
                                            legend: {
                                                display: false
                                            },                                            
                                        },
                                        scales: {
                                            x: {
                                              grid: {
                                                display: false
                                              },                                                                                            
                                            },
                                            y: {
                                              grid: {
                                                display: false                                                
                                              },                             
                                              ticks:{
                                                stepSize:1
                                              }                                                                                                             
                                            }
                                          }
                                    }}
                                />
                            </div>
                            </div>
                        </div>                        
                    }
                </div>
            </div>
        </div>
    )
}
