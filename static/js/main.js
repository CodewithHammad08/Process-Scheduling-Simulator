document.addEventListener('DOMContentLoaded', () => {
    const addProcessBtn = document.getElementById('add-process');
    const simulateBtn = document.getElementById('simulate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const compareBtn = document.getElementById('compare-btn');
    const processTableBody = document.getElementById('process-table-body');
    const algoSelect = document.getElementById('algo-select');
    const quantumGroup = document.getElementById('quantum-group');
    const ganttContainer = document.getElementById('gantt-chart');
    const resultsArea = document.getElementById('results-area');

    let processCount = 3;
    let performanceChart = null;

    // Reset logic
    resetBtn.addEventListener('click', () => {
        processTableBody.innerHTML = `
            <tr>
                <td>P1</td>
                <td><input type="number" class="arrival" value="0" min="0"></td>
                <td><input type="number" class="burst" value="5" min="1"></td>
                <td class="priority-column"><input type="number" class="priority" value="1" min="1"></td>
                <td></td>
            </tr>
        `;
        processCount = 1;
        resultsArea.style.display = 'none';
        if (performanceChart) performanceChart.destroy();
        updateVisibility();
    });

    // Toggle Quantum and Priority input
    function updateVisibility() {
        const algo = algoSelect.value;
        
        // Show Quantum for RR
        quantumGroup.style.display = (algo === 'RR') ? 'block' : 'none';
        
        // Show Priority for Priority algos
        const isPriority = (algo === 'Priority' || algo === 'Priority_P');
        const prioCols = document.querySelectorAll('.priority-column');
        prioCols.forEach(col => {
            col.style.display = isPriority ? 'table-cell' : 'none';
        });
    }

    algoSelect.addEventListener('change', updateVisibility);
    updateVisibility(); // Initial call

    // Add process row
    addProcessBtn.addEventListener('click', () => {
        processCount++;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>P${processCount}</td>
            <td><input type="number" class="arrival" value="0" min="0"></td>
            <td><input type="number" class="burst" value="1" min="1"></td>
            <td class="priority-column"><input type="number" class="priority" value="1" min="1"></td>
            <td><button class="btn btn-danger remove-row">×</button></td>
        `;
        processTableBody.appendChild(row);
        updateVisibility();
        
        row.querySelector('.remove-row').addEventListener('click', () => {
            row.remove();
        });
    });

    // Helper to get processes from table
    function getProcesses() {
        const rows = document.querySelectorAll('#process-table-body tr');
        let valid = true;
        const processes = Array.from(rows).map(row => {
            const arrival = row.querySelector('.arrival').value;
            const burst = row.querySelector('.burst').value;
            const priority = row.querySelector('.priority').value;

            if (arrival === '' || burst === '' || priority === '') {
                valid = false;
            }

            return {
                id: row.cells[0].innerText,
                arrival: arrival,
                burst: burst,
                priority: priority
            };
        });
        return valid ? processes : null;
    }

    // Helper for CSRF
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Simulate function
    simulateBtn.addEventListener('click', async () => {
        const processes = getProcesses();
        if (!processes) {
            alert('Please fill in all process details.');
            return;
        }
        if (processes.length === 0) {
            alert('Please add at least one process.');
            return;
        }

        const data = {
            algorithm: algoSelect.value,
            quantum: document.getElementById('quantum').value,
            processes: processes
        };

        simulateBtn.disabled = true;
        simulateBtn.innerHTML = 'Simulating...';

        try {
            const response = await fetch('/simulate/', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (result.error) throw new Error(result.error);

            renderResults(result);
        } catch (error) {
            alert('Error: ' + error.message);
        } finally {
            simulateBtn.disabled = false;
            simulateBtn.innerHTML = 'Start Simulation';
        }
    });

    // Compare All function
    compareBtn.addEventListener('click', async () => {
        // Show priority column for comparison since it uses priority algorithms
        const prioCols = document.querySelectorAll('.priority-column');
        prioCols.forEach(col => col.style.display = 'table-cell');

        const processes = getProcesses();
        if (!processes) {
            alert('Please fill in all process details.');
            return;
        }
        if (processes.length === 0) {
            alert('Please add at least one process.');
            return;
        }
        const data = {
            algorithm: 'COMPARE',
            quantum: document.getElementById('quantum').value,
            processes: processes
        };

        compareBtn.disabled = true;
        compareBtn.innerHTML = 'Calculating...';

        try {
            const response = await fetch('/simulate/', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (result.error) throw new Error(result.error);

            renderComparison(result.comparison);
        } catch (error) {
            alert('Error: ' + error.message);
        } finally {
            compareBtn.disabled = false;
            compareBtn.innerHTML = '🚀 Compare All Algorithms';
        }
    });

    function renderComparison(comparison) {
        resultsArea.style.display = 'block';
        ganttContainer.innerHTML = '<div style="width: 100%; text-align: center; color: var(--text-muted); padding: 1rem;">Gantt chart not available in comparison mode</div>';
        document.getElementById('results-table-body').innerHTML = '';
        document.getElementById('avg-wt').innerText = '-';
        document.getElementById('avg-tat').innerText = '-';

        const labels = comparison.map(c => c.name);
        const wtData = comparison.map(c => c.avg_waiting);
        const tatData = comparison.map(c => c.avg_tat);

        const ctx = document.getElementById('performanceChart').getContext('2d');
        if (performanceChart) performanceChart.destroy();
        
        performanceChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Avg Waiting Time',
                        data: wtData,
                        backgroundColor: 'rgba(99, 102, 241, 0.7)',
                    },
                    {
                        label: 'Avg Turnaround Time',
                        data: tatData,
                        backgroundColor: 'rgba(16, 185, 129, 0.7)',
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#f8fafc' } } },
                scales: {
                    y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                    x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
                }
            }
        });
        resultsArea.scrollIntoView({ behavior: 'smooth' });
    }

    async function renderResults(result) {
        resultsArea.style.display = 'block';
        ganttContainer.innerHTML = '';
        const totalTime = result.gantt[result.gantt.length - 1].end;
        
        // Ensure that each time unit has at least 40px width for readability
        const minWidthPerUnit = 40;
        const calculatedWidth = totalTime * minWidthPerUnit;
        const containerWidth = ganttContainer.parentElement.clientWidth;
        
        // If calculated width is more than container, expand the chart width
        if (calculatedWidth > containerWidth) {
            ganttContainer.style.width = `${calculatedWidth}px`;
        } else {
            ganttContainer.style.width = '100%';
        }

        const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

        for (const [index, block] of result.gantt.entries()) {
            const width = ((block.end - block.start) / totalTime) * 100;
            const blockEl = document.createElement('div');
            blockEl.className = 'gantt-block' + (block.id === 'IDLE' ? ' idle' : '');
            blockEl.style.width = `${width}%`;
            blockEl.style.opacity = '0';
            blockEl.style.transform = 'scaleX(0)';
            blockEl.style.transformOrigin = 'left';
            blockEl.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            
            if (block.id !== 'IDLE') {
                blockEl.style.background = `linear-gradient(135deg, ${colors[index % colors.length]}, rgba(255,255,255,0.1))`;
            }

            blockEl.innerHTML = `
                ${block.id === 'IDLE' ? '<span style="font-size: 0.7rem; opacity: 0.5">Idle</span>' : block.id}
                <span class="time-label">${block.start}</span>
                ${index === result.gantt.length - 1 ? `<span class="time-end">${block.end}</span>` : ''}
            `;
            ganttContainer.appendChild(blockEl);
            
            // Trigger animation
            await new Promise(r => setTimeout(r, 100));
            blockEl.style.opacity = '1';
            blockEl.style.transform = 'scaleX(1)';
        }

        document.getElementById('avg-wt').innerText = result.avg_waiting;
        document.getElementById('avg-tat').innerText = result.avg_tat;

        const resultsTableBody = document.getElementById('results-table-body');
        resultsTableBody.innerHTML = '';
        const pids = Object.keys(result.waiting);
        pids.forEach(pid => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="padding: 0.75rem">${pid}</td>
                <td style="padding: 0.75rem">${result.waiting[pid]}</td>
                <td style="padding: 0.75rem">${result.tat[pid]}</td>
            `;
            resultsTableBody.appendChild(row);
        });

        const ctx = document.getElementById('performanceChart').getContext('2d');
        if (performanceChart) performanceChart.destroy();
        performanceChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: pids,
                datasets: [
                    { label: 'Waiting Time', data: pids.map(pid => result.waiting[pid]), backgroundColor: 'rgba(99, 102, 241, 0.5)' },
                    { label: 'Turnaround Time', data: pids.map(pid => result.tat[pid]), backgroundColor: 'rgba(16, 185, 129, 0.5)' }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#94a3b8' } },
                    x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                },
                plugins: { legend: { labels: { color: '#f8fafc' } } }
            }
        });
        resultsArea.scrollIntoView({ behavior: 'smooth' });
    }
});
