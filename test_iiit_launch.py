from nexus_q import NexusQ

def test_iiit_launch():
    engine = NexusQ()
    print("\033[95m[ MISSION: IIIT PUNE AI CLUB LAUNCH ]\033[0m")
    
    # We use reason_recursive to demonstrate Phase 4 scaling
    strategy = engine.reason_recursive("Plan IIIT Pune AI club launch strategy.")
    
    print(f"\n\033[92m[Final Strategy for IIIT Pune]\033[0m\n{strategy}")

if __name__ == "__main__":
    test_iiit_launch()
