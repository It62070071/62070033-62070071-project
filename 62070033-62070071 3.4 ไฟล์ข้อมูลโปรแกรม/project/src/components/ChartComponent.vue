<template>
    <div class="container">
        <div class="columns ml-3 mr-3">
            <div class="column is-6">
                <div class="box">
                    <canvas id="myChart1"></canvas>
                </div>

                <div class="box">
                    <canvas id="myChart3"></canvas>
                </div>
            </div>

            <div class="column is-6">
                <div class="box">
                    <canvas id="myChart2"></canvas>
                </div>

                <div class="box">
                    <canvas id="myChart4"></canvas>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import axios from '@/plugins/axios'
    import Chart from 'chart.js/auto'
    import moment from 'moment'
    export default{
        name: "ChartComponent",
        data(){
            return{
                data1: [],
                data2: [],
                data3: [],
                data4: [],
                name_months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            }
        },
        mounted(){
            axios.get(`/main/${this.$route.params.id}`)
            .then((res) => {
                this.data1 = res.data.data1
                this.data2 = res.data.data2
                this.data3 = res.data.data3
                this.data4 = res.data.data4

                const chart1 = document.getElementById('myChart1')
                const chart2 = document.getElementById('myChart2')
                const chart3 = document.getElementById('myChart3')
                const chart4 = document.getElementById('myChart4')

            new Chart(chart1, {
                type: 'line',
                data: {
                    labels: this.data1.map(item => moment(item.date).format('YYYY-MM-DD')),
                    datasets: [{
                        label: 'Water',
                        data: this.data1.map(item => item.total_amount),
                        backgroundColor: [
                        'rgba(54, 162, 235, 0.2)',
                        ],
                        borderColor: [
                        'rgb(54, 162, 235)',
                        ],
                        borderWidth: 2
                    },]
                },
                options: {
                    scales: {
                        y: {
                            min: 0,
                        }
                    }
                }
            });

            new Chart(chart2, {
                type: 'line',
                data: {
                    labels: this.data2.map(item => moment(item.date).format('YYYY-MM-DD')),
                    datasets: [{
                        label: 'Beer',
                        data: this.data2.map(item => item.total_amount),
                        backgroundColor: [
                        'rgba(255, 159, 64, 0.2)',
                        ],
                        borderColor: [
                        'rgb(255, 159, 64)',
                        ],
                        borderWidth: 2
                    },]
                },
                options: {
                    scales: {
                        y: {
                            min: 0,
                        }
                    }
                }
            });

            new Chart(chart3, {
                type: 'line',
                data: {
                    labels: this.data3.map(item => moment(item.date).format('YYYY-MM-DD')),
                    datasets: [{
                        label: 'Soft Drink',
                        data: this.data3.map(item => item.total_amount),
                        backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        ],
                        borderColor: [
                        'rgb(255, 99, 132)',
                        ],
                        borderWidth: 2
                    },]
                },
                options: {
                    scales: {
                        y: {
                            min: 0,
                        }
                    }
                }
            });

            var name = this.data4.map((item) => {return this.name_months[item.month - 1]})
            new Chart(chart4, {
                type: 'line',
                data: {
                    labels: name,
                    datasets: [{
                        label: 'Water In Each Month',
                        data: this.data4.map(item => item.total_amount),
                        fill: false,
                        backgroundColor: [
                        'rgba(153, 102, 255, 0.2)',
                        ],
                        borderColor: [
                        'rgb(153, 102, 255)',
                        ],
                        borderWidth: 2
                    },]
                },
                options: {
                    scales: {
                        y: {
                            min: 0,
                            max: 100000,
                            // beginAtZero: true
                        }
                    }
                }
            });
            }).catch((err) => {
                console.log(err)
            })

        },
    }
</script>