import json
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from . import algorithms

def home(request):
    return render(request, 'index.html')

def simulate(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            algo_type = data.get('algorithm')
            processes = data.get('processes', [])
            quantum = int(data.get('quantum', 1))
            
            # Map processes from frontend format
            # Expected: { id, arrival, burst, priority }
            for p in processes:
                p['arrival'] = int(p['arrival'])
                p['burst'] = int(p['burst'])
                p['priority'] = int(p.get('priority', 0))

            if algo_type == 'FCFS':
                gantt, waiting, tat = algorithms.fcfs(processes)
            elif algo_type == 'SJF':
                gantt, waiting, tat = algorithms.sjf_non_preemptive(processes)
            elif algo_type == 'SRTF':
                gantt, waiting, tat = algorithms.sjf_preemptive(processes)
            elif algo_type == 'Priority':
                gantt, waiting, tat = algorithms.priority_non_preemptive(processes)
            elif algo_type == 'Priority_P':
                gantt, waiting, tat = algorithms.priority_preemptive(processes)
            elif algo_type == 'RR':
                gantt, waiting, tat = algorithms.round_robin(processes, quantum)
            elif algo_type == 'COMPARE':
                return compare_all(processes, quantum)
            else:
                return JsonResponse({'error': 'Invalid algorithm'}, status=400)

            # Calculate Averages
            avg_waiting = sum(waiting.values()) / len(waiting) if waiting else 0
            avg_tat = sum(tat.values()) / len(tat) if tat else 0

            return JsonResponse({
                'gantt': gantt,
                'waiting': waiting,
                'tat': tat,
                'avg_waiting': round(avg_waiting, 2),
                'avg_tat': round(avg_tat, 2)
            })
        except Exception as e:
            import traceback
            print(traceback.format_exc())
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'POST required'}, status=405)

def compare_all(processes, quantum):
    algos = {
        'FCFS': algorithms.fcfs,
        'SJF': algorithms.sjf_non_preemptive,
        'SRTF': algorithms.sjf_preemptive,
        'Priority': algorithms.priority_non_preemptive,
        'Priority (P)': algorithms.priority_preemptive,
        'Round Robin': lambda p: algorithms.round_robin(p, quantum)
    }
    
    comparison_results = []
    for name, func in algos.items():
        # Use deep copies of processes to avoid mutation
        import copy
        g, w, t = func(copy.deepcopy(processes))
        avg_w = sum(w.values()) / len(w) if w else 0
        avg_t = sum(t.values()) / len(t) if t else 0
        comparison_results.append({
            'name': name,
            'avg_waiting': round(avg_w, 2),
            'avg_tat': round(avg_t, 2)
        })
    
    return JsonResponse({'comparison': comparison_results})
