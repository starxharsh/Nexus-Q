from nexus_q import NexusQ

def test_engine():
    engine = NexusQ()
    # Testing the specific portfolio reasoning prompt
    engine.reason("Optimal portfolio: 40% stocks at 8% return, 60% bonds at 4%, risk-adjusted?")

if __name__ == "__main__":
    test_engine()
