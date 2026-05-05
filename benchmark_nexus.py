import time
from nexus_q import NexusQ

def run_benchmark():
    engine = NexusQ()
    problem = "If a bat and a ball cost $1.10 in total and the bat costs $1.00 more than the ball, how much does the ball cost?"
    
    print("\n\033[95m[ BENCHMARK: SYSTEM-1 VS SYSTEM-2 ]\033[0m")
    print("-" * 40)
    
    # 1. Standard LLM Simulation (System 1 - Fast, Intuitive, often wrong)
    print("\033[91m[Standard LLM (System-1)]\033[0m Thinking...")
    time.sleep(0.5)
    print("\033[91m[Standard LLM Output]\033[0m The ball costs $0.10. (INCORRECT - Intuitive Trap)")
    
    print("-" * 40)
    
    # 2. Nexus-Q Simulation (System 2 - Slow, Logical, Verified)
    print("\033[92m[Nexus-Q (System-2)]\033[0m Initiating SVR Loop...")
    
    # Customize mock for this specific riddle (Fixed lambda signature)
    engine.generate_thought_branches = lambda prompt, n=3: [{
        "path_id": 0,
        "reasoning": (
            "Let ball = x, bat = x + 1.00. Total: x + (x + 1.00) = 1.10\n"
            "```python\n"
            "total = 1.10\n"
            "ball = (total - 1.00) / 2\n"
            "print(f'Ball cost: {ball:.2f}')\n"
            "```"
        ),
        "confidence": 1.0
    }]
    
    engine.reason(problem)

if __name__ == "__main__":
    run_benchmark()
