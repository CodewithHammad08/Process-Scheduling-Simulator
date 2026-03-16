def calculate_metrics(processes, gantt):
    completion_times = {}
    for entry in gantt:
        if entry['id'] != 'IDLE':
            completion_times[entry['id']] = entry['end']
    
    waiting_times = {}
    turnaround_times = {}
    for p in processes:
        pid = p['id']
        tat = completion_times[pid] - p['arrival']
        wt = tat - p['burst']
        turnaround_times[pid] = tat
        waiting_times[pid] = wt
    return waiting_times, turnaround_times

def fcfs(processes):
    sorted_processes = sorted(processes, key=lambda x: x['arrival'])
    time = 0
    gantt = []
    for p in sorted_processes:
        if time < p['arrival']:
            gantt.append({'id': 'IDLE', 'start': time, 'end': p['arrival']})
            time = p['arrival']
        start = time
        finish = time + p['burst']
        gantt.append({'id': p['id'], 'start': start, 'end': finish})
        time = finish
    waiting, tat = calculate_metrics(processes, gantt)
    return gantt, waiting, tat

def sjf_non_preemptive(processes):
    n = len(processes)
    remaining_processes = [p.copy() for p in processes]
    time = 0
    gantt = []
    completed = 0
    while completed < n:
        available = [p for p in remaining_processes if p['arrival'] <= time]
        if not available:
            next_arrival = min(p['arrival'] for p in remaining_processes)
            gantt.append({'id': 'IDLE', 'start': time, 'end': next_arrival})
            time = next_arrival
            continue
        best = min(available, key=lambda x: x['burst'])
        gantt.append({'id': best['id'], 'start': time, 'end': time + best['burst']})
        time += best['burst']
        remaining_processes.remove(best)
        completed += 1
    waiting, tat = calculate_metrics(processes, gantt)
    return gantt, waiting, tat

def priority_non_preemptive(processes):
    n = len(processes)
    remaining_processes = [p.copy() for p in processes]
    time = 0
    gantt = []
    completed = 0
    while completed < n:
        available = [p for p in remaining_processes if p['arrival'] <= time]
        if not available:
            next_arrival = min(p['arrival'] for p in remaining_processes)
            gantt.append({'id': 'IDLE', 'start': time, 'end': next_arrival})
            time = next_arrival
            continue
        best = min(available, key=lambda x: x['priority'])
        gantt.append({'id': best['id'], 'start': time, 'end': time + best['burst']})
        time += best['burst']
        remaining_processes.remove(best)
        completed += 1
    waiting, tat = calculate_metrics(processes, gantt)
    return gantt, waiting, tat

def round_robin(processes, quantum):
    n = len(processes)
    rem_burst = {p['id']: p['burst'] for p in processes}
    arrival_map = {p['id']: p['arrival'] for p in processes}
    sorted_pids = [p['id'] for p in sorted(processes, key=lambda x: x['arrival'])]
    queue = []
    gantt = []
    time = 0
    completed = 0
    visited = set()
    
    def update_queue():
        for pid in sorted_pids:
            if arrival_map[pid] <= time and pid not in visited and rem_burst[pid] > 0:
                queue.append(pid)
                visited.add(pid)

    update_queue()
    while completed < n:
        if not queue:
            next_arrival = min([arrival_map[pid] for pid in sorted_pids if pid not in visited and rem_burst[pid] > 0])
            gantt.append({'id': 'IDLE', 'start': time, 'end': next_arrival})
            time = next_arrival
            update_queue()
            continue
        cid = queue.pop(0)
        start = time
        execute = min(rem_burst[cid], quantum)
        rem_burst[cid] -= execute
        time += execute
        gantt.append({'id': cid, 'start': start, 'end': time})
        update_queue()
        if rem_burst[cid] > 0: queue.append(cid)
        else: completed += 1
    waiting, tat = calculate_metrics(processes, gantt)
    return gantt, waiting, tat

def sjf_preemptive(processes):
    n = len(processes)
    rem_burst = {p['id']: p['burst'] for p in processes}
    arrival_map = {p['id']: p['arrival'] for p in processes}
    time = 0
    completed = 0
    gantt = []
    while completed < n:
        available = [p for p in processes if arrival_map[p['id']] <= time and rem_burst[p['id']] > 0]
        if not available:
            next_arrival = min([arrival_map[p['id']] for p in processes if rem_burst[p['id']] > 0])
            gantt.append({'id': 'IDLE', 'start': time, 'end': next_arrival})
            time = next_arrival
            continue
        best = min(available, key=lambda x: rem_burst[x['id']])
        pid = best['id']
        if gantt and gantt[-1]['id'] == pid:
            gantt[-1]['end'] = time + 1
        else:
            gantt.append({'id': pid, 'start': time, 'end': time + 1})
        rem_burst[pid] -= 1
        time += 1
        if rem_burst[pid] == 0: completed += 1
    waiting, tat = calculate_metrics(processes, gantt)
    return gantt, waiting, tat

def priority_preemptive(processes):
    n = len(processes)
    rem_burst = {p['id']: p['burst'] for p in processes}
    arrival_map = {p['id']: p['arrival'] for p in processes}
    priority_map = {p['id']: p['priority'] for p in processes}
    time = 0
    completed = 0
    gantt = []
    while completed < n:
        available = [p for p in processes if arrival_map[p['id']] <= time and rem_burst[p['id']] > 0]
        if not available:
            next_arrival = min([arrival_map[p['id']] for p in processes if rem_burst[p['id']] > 0])
            gantt.append({'id': 'IDLE', 'start': time, 'end': next_arrival})
            time = next_arrival
            continue
        best = min(available, key=lambda x: priority_map[x['id']])
        pid = best['id']
        if gantt and gantt[-1]['id'] == pid:
            gantt[-1]['end'] = time + 1
        else:
            gantt.append({'id': pid, 'start': time, 'end': time + 1})
        rem_burst[pid] -= 1
        time += 1
        if rem_burst[pid] == 0: completed += 1
    waiting, tat = calculate_metrics(processes, gantt)
    return gantt, waiting, tat
