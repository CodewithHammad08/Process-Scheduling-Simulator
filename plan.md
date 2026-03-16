# 🖥️ Process Scheduling Simulator (OS PBL Project)

A **web-based simulator** that demonstrates how an Operating System schedules processes in the CPU using different scheduling algorithms.

This project helps visualize **CPU scheduling concepts**, calculate performance metrics, and generate **Gantt Charts** for better understanding.

---

# 1. 📌 Project Overview

## Objective

To design and implement a **web application that simulates CPU scheduling algorithms** and visually displays the execution order of processes.

The system allows users to:

* Select a scheduling algorithm
* Enter process details
* Simulate scheduling
* Visualize results using **Gantt charts**
* Calculate scheduling metrics

---

# 2. 🎯 Learning Outcomes

By completing this project you will understand:

* CPU Scheduling in Operating Systems
* Process execution order
* Waiting Time calculation
* Turnaround Time calculation
* Gantt Chart representation
* Algorithm comparison

---

# 3. ⚙️ Algorithms Implemented

## 1. FCFS (First Come First Serve)

Processes are executed in the order they arrive.

Example:

| Process | Arrival | Burst |
| ------- | ------- | ----- |
| P1      | 0       | 5     |
| P2      | 1       | 3     |
| P3      | 2       | 4     |

Execution Order:

P1 → P2 → P3

Advantages

* Simple
* Easy to implement

Disadvantages

* Can cause **Convoy Effect**

---

## 2. SJF (Shortest Job First)

The process with the **smallest burst time executes first**.

Example:

| Process | Burst |
| ------- | ----- |
| P1      | 6     |
| P2      | 3     |
| P3      | 8     |
| P4      | 2     |

Execution Order:

P4 → P2 → P1 → P3

Advantages

* Minimum average waiting time

Disadvantages

* Starvation possible

---

## 3. Round Robin

Each process gets **fixed time quantum**.

Example:

Time Quantum = 2

Execution Pattern:

P1 → P2 → P3 → P1 → P2 → P3

Advantages

* Fair scheduling
* Used in **time-sharing systems**

---

## 4. Priority Scheduling

Each process has a priority.

Higher priority executes first.

Example:

| Process | Priority |
| ------- | -------- |
| P1      | 3        |
| P2      | 1        |
| P3      | 2        |

Execution Order:

P2 → P3 → P1

---

# 4. 🧠 Scheduling Metrics

## Waiting Time

```
Waiting Time = Start Time - Arrival Time
```

Total Waiting Time:

```
Average Waiting Time = Total Waiting Time / Number of Processes
```

---

## Turnaround Time

```
Turnaround Time = Completion Time - Arrival Time
```

Average Turnaround Time:

```
Average TAT = Total TAT / Number of Processes
```

---

# 5. 🏗 System Architecture

```
User
 │
 ▼
Frontend (HTML + CSS + JS)
 │
 ▼
Django Backend
 │
 ▼
Scheduling Algorithm Engine
 │
 ▼
Result Generator
 │
 ▼
Gantt Chart Visualization
```

---

# 6. 🛠 Technology Stack

Backend

* Django
* Python

Frontend

* HTML
* CSS
* JavaScript

Visualization

* Chart.js
* Bootstrap (optional)

---

# 7. 📁 Project Folder Structure

```
process_scheduler/
│
├── scheduler_project/
│
│   ├── settings.py
│   ├── urls.py
│
├── scheduler_app/
│
│   ├── views.py
│   ├── algorithms.py
│   ├── models.py
│   ├── urls.py
│
├── templates/
│   ├── index.html
│   ├── result.html
│
├── static/
│   ├── css
│   ├── js
│
└── manage.py
```

---

# 8. 🚀 Step-by-Step Implementation

---

# Step 1: Create Django Project

```
django-admin startproject scheduler_project
cd scheduler_project
python manage.py startapp scheduler_app
```

---

# Step 2: Add App to settings.py

```
INSTALLED_APPS = [
    'scheduler_app'
]
```

---

# Step 3: URL Configuration

Project urls.py

```
from django.urls import path, include

urlpatterns = [
    path('', include('scheduler_app.urls')),
]
```

App urls.py

```
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('simulate/', views.simulate, name='simulate'),
]
```

---

# Step 4: Process Scheduling Logic

Create **algorithms.py**

Example FCFS:

```python
def fcfs(processes):
    processes.sort(key=lambda x: x['arrival'])

    time = 0
    gantt = []
    waiting_times = {}
    turnaround_times = {}

    for p in processes:

        if time < p['arrival']:
            time = p['arrival']

        start = time
        finish = time + p['burst']

        gantt.append((p['id'], start, finish))

        waiting_times[p['id']] = start - p['arrival']
        turnaround_times[p['id']] = finish - p['arrival']

        time = finish

    return gantt, waiting_times, turnaround_times
```

---

# Step 5: Django View

views.py

```python
from django.shortcuts import render
from .algorithms import fcfs

def home(request):
    return render(request,'index.html')

def simulate(request):

    if request.method == "POST":

        processes = [
            {"id":"P1","arrival":0,"burst":5},
            {"id":"P2","arrival":1,"burst":3},
            {"id":"P3","arrival":2,"burst":4},
        ]

        gantt, waiting, tat = fcfs(processes)

        context = {
            "gantt":gantt,
            "waiting":waiting,
            "tat":tat
        }

        return render(request,"result.html",context)
```

---

# 9. 📊 Gantt Chart Visualization

Using Chart.js.

Add in **result.html**

```html
<canvas id="ganttChart"></canvas>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<script>
const data = {
labels: ["P1","P2","P3"],
datasets: [{
label: "CPU Timeline",
data: [5,3,4]
}]
}

new Chart(
document.getElementById('ganttChart'),
{
type:'bar',
data:data
});
</script>
```

---

# 10. 📈 Example Output

Input

| Process | Arrival | Burst |
| ------- | ------- | ----- |
| P1      | 0       | 5     |
| P2      | 1       | 3     |
| P3      | 2       | 4     |

Output

Gantt Chart

```
0  P1  5  P2  8  P3  12
```

Waiting Times

| Process | WT |
| ------- | -- |
| P1      | 0  |
| P2      | 4  |
| P3      | 6  |

Turnaround Times

| Process | TAT |
| ------- | --- |
| P1      | 5   |
| P2      | 7   |
| P3      | 10  |

---

# 11. 🌟 Advanced Features (For Higher Marks)

Add these features:

### 1. Interactive Gantt Chart

Real-time visualization.

### 2. Algorithm Comparison

Compare

* FCFS
* SJF
* Round Robin
* Priority

### 3. Process Table Input

User dynamically adds processes.

### 4. Animated Scheduling

Show **CPU executing processes step-by-step**.

### 5. Performance Graphs

Compare

* Average waiting time
* Average turnaround time

---

# 12. 📚 Future Improvements

* Multi-CPU simulation
* Real-time scheduling
* OS process states visualization
* Process queue animations

---

# 13. 📦 GitHub README Description

Process Scheduling Simulator is a web-based application that demonstrates how operating systems schedule processes using various CPU scheduling algorithms such as FCFS, SJF, Round Robin, and Priority Scheduling. The system allows users to input processes and visualize execution order through a Gantt Chart while calculating waiting time and turnaround time.

---

# 14. 🎓 Conclusion

This project provides a **practical visualization of CPU scheduling algorithms** used in Operating Systems. It allows students to experiment with different scheduling techniques and observe how they impact system performance.

The simulator bridges theoretical OS concepts with interactive learning through visualization.

---

# ⭐ Project Difficulty

Intermediate

Perfect for:

* Operating System PBL
* Final Year Mini Project
* GitHub Portfolio
* Algorithm Visualization
