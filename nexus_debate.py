import time
from nexus_q import NexusQ

class NexusDebate:
    """
    Phase 5: Multi-Agent Debate.
    Orchestrates a logical battle between two Nexus-Q agents to reach the ultimate truth.
    """
    
    def __init__(self, proposer_cfg=None, challenger_cfg=None):
        self.proposer = NexusQ(provider="Proposer")
        self.challenger = NexusQ(provider="Challenger")
        print("\033[95m[Debate Engine]\033[0m Dual-Agent Arena Initialized.")

    def run_debate(self, query: str, max_rounds: int = 3):
        print(f"\n\033[94m[Topic]\033[0m {query}")
        
        current_thesis = self.proposer.reason(query)
        
        for r in range(max_rounds):
            print(f"\n\033[91m[ROUND {r+1}: THE CHALLENGE]\033[0m")
            
            # The Challenger finds flaws in the thesis
            challenge_query = f"Critically analyze this thesis and find flaws: {current_thesis}"
            flaws = self.challenger.reason(challenge_query)
            
            print(f"\033[91m[Challenger]\033[0m I found these issues: {flaws}")
            
            print(f"\n\033[92m[ROUND {r+1}: THE REFINEMENT]\033[0m")
            
            # The Proposer refines the thesis based on the flaws
            refine_query = f"Refine your original thesis: {current_thesis} based on these valid flaws: {flaws}"
            current_thesis = self.proposer.reason(refine_query)
            
            # Optional: Check for consensus (in mock we just do rounds)
            time.sleep(1)
            
        print("\n\033[95m[DEBATE COMPLETE: FINAL CONSENSUS REACHED]\033[0m")
        print(f"\033[92m[Synthesized Truth]\033[0m {current_thesis}")
        return current_thesis

if __name__ == "__main__":
    debate = NexusDebate()
    debate.run_debate("Is AGI possible using only Transformer architectures?")
