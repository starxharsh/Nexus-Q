import os
import sys
import time
from nexus_q import NexusQ

def print_banner():
    banner = """
    \033[94m
    [ NEXUS-Q : SYSTEM-2 REASONING ENGINE ]
    ---------------------------------------
    \033[0m
    \033[92mStatus: ACTIVE | Mode: ELITE REASONING\033[0m
    \033[90mBorn at IIIT Pune - The Future of Autonomous AI\033[0m
    """
    print(banner)

def main():
    os.system('cls' if os.name == 'nt' else 'clear')
    print_banner()
    
    bot = NexusQ()
    
    print("\n\033[93mNexus-Q is online. How shall we solve the future today?\033[0m")
    
    while True:
        try:
            user_input = input("\n\033[94mUser >\033[0m ")
            if user_input.lower() in ["exit", "quit"]:
                print("\033[91mShutting down Nexus-Q...\033[0m")
                break
                
            if not user_input.strip():
                continue
                
            bot.solve(user_input)
            
        except KeyboardInterrupt:
            print("\n\033[91mSession Terminated.\033[0m")
            break

if __name__ == "__main__":
    main()
