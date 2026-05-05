import asyncio
from nexus_q import NexusQ

async def test_async_debate():
    engine = NexusQ()
    print("\033[95m[ MISSION: IIIT PUNE E-SUMMIT '26 - VENTURE VALIDATION ]\033[0m")
    
    # Run the upgraded Phase 5 Multi-Agent Debate
    verdict = await engine.debate_reason(
        "Validate the scalability of an AI-first grooming tool conglomerate like Ovaros in the Indian market.",
        rounds=2
    )
    
    print(f"\n\033[92m[Final Strategic Verdict]\033[0m\n{verdict}")

if __name__ == "__main__":
    asyncio.run(test_async_debate())
