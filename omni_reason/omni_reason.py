import random
import json
import time

class ReasoningNode:
    def __init__(self, content, parent=None, depth=0):
        self.content = content
        self.parent = parent
        self.children = []
        self.score = 0.0
        self.visits = 0
        self.depth = depth
        self.is_terminal = False
        self.is_hallucination = False

    def add_child(self, child_node):
        self.children.append(child_node)

    def to_dict(self):
        return {
            "content": self.content,
            "score": round(self.score, 2),
            "visits": self.visits,
            "depth": self.depth,
            "is_hallucination": self.is_hallucination,
            "children": [c.to_dict() for c in self.children]
        }

class OmniReasonEngine:
    def __init__(self, problem):
        self.problem = problem
        self.root = ReasoningNode(problem)
        self.world_knowledge = {
            "Fusion": {"score": 0.9, "risk": 0.1},
            "Dyson Swarm": {"score": 0.95, "risk": 0.4},
            "Perpetual Motion": {"score": -1.0, "risk": 1.0, "hallucination": True},
            "Efficiency": {"score": 0.7, "risk": 0.05}
        }

    def simulate_thinking(self, iterations=20):
        print(f"[*] Solving: {self.problem}")
        for i in range(iterations):
            # 1. Selection & Expansion
            node = self.select_promising_node(self.root)
            if node.depth < 3: # Max depth
                self.expand_node(node)
            
            # 2. Simulation (Evaluation)
            score = self.evaluate_node(node)
            
            # 3. Backpropagation
            self.backpropagate(node, score)
            
            time.sleep(0.1) # Simulate compute time

    def select_promising_node(self, node):
        if not node.children:
            return node
        # Simple UCB-style selection
        return max(node.children, key=lambda x: x.score + (1.0 / (x.visits + 1)))

    def expand_node(self, node):
        # The "LLM" proposes new branches
        ideas = [
            f"Approach {len(node.children)+1}: Investigate {random.choice(list(self.world_knowledge.keys()))}",
            f"Step {len(node.children)+1}: Optimize current variables",
            f"Alternative {len(node.children)+1}: Pivot to decentralized systems"
        ]
        
        for idea in ideas:
            child = ReasoningNode(idea, parent=node, depth=node.depth + 1)
            # Detect hallucination based on "World Model"
            for k, v in self.world_knowledge.items():
                if k in idea and v.get("hallucination"):
                    child.is_hallucination = True
            node.add_child(child)

    def evaluate_node(self, node):
        # The "Verifier" checks the path
        if node.is_hallucination:
            return -1.0
        
        base_score = random.uniform(0.1, 0.8)
        for k, v in self.world_knowledge.items():
            if k in node.content:
                base_score = v["score"]
        
        return base_score

    def backpropagate(self, node, score):
        curr = node
        while curr:
            curr.visits += 1
            # Update average score
            curr.score = (curr.score * (curr.visits - 1) + score) / curr.visits
            curr = curr.parent

    def export_results(self, filename="reasoning_tree.json"):
        with open(filename, "w") as f:
            json.dump(self.root.to_dict(), f, indent=4)
        print(f"[+] Tree exported to {filename}")

if __name__ == "__main__":
    engine = OmniReasonEngine("Universal Energy Abundance Strategy")
    engine.simulate_thinking(30)
    engine.export_results()
