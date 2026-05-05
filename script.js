document.addEventListener('DOMContentLoaded', () => {
    const queryInput = document.getElementById('queryInput');
    const submitBtn = document.getElementById('submitBtn');
    const terminalOutput = document.getElementById('terminalOutput');

    function appendLog(text, type = 'system') {
        const div = document.createElement('div');
        div.className = `log-entry ${type}`;
        div.textContent = text;
        terminalOutput.appendChild(div);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    async function handleQuery() {
        const query = queryInput.value.trim();
        if (!query) return;

        // Reset UI
        submitBtn.disabled = true;
        terminalOutput.innerHTML = '';
        appendLog(`> USER_QUERY: ${query}`, 'user');
        appendLog('> INITIATING MULTI-AGENT DEBATE PROTOCOL...', 'system');

        try {
            // Because we don't have server-side streaming setup yet, we will simulate
            // the visual streaming of the logs locally while waiting for the API response.
            
            // Start a visual "thinking" loop
            let isThinking = true;
            const thinkingPhases = [
                "[Proponent] Analyzing base parameters...",
                "[Critic] Scanning for logical vulnerabilities...",
                "[Judge] Evaluating adversarial arguments...",
                "[Proponent] Refining thesis based on critique...",
                "[Critic] Performing secondary audit..."
            ];
            
            let phaseIndex = 0;
            const thinkingInterval = setInterval(() => {
                if (!isThinking) {
                    clearInterval(thinkingInterval);
                    return;
                }
                const phase = thinkingPhases[phaseIndex % thinkingPhases.length];
                const type = phase.includes("Proponent") ? "proposer" : (phase.includes("Critic") ? "critic" : "system");
                appendLog(`> ${phase}`, type);
                phaseIndex++;
            }, 2000);

            // Fetch from our live API
            const response = await fetch('/api/reason', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: query,
                    debate: true
                })
            });

            isThinking = false;

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            
            appendLog('\n> [DEBATE CONCLUDED]', 'system');
            appendLog(`> [FINAL SYNTHESIS]\n${data.result}`, 'judge');

        } catch (error) {
            appendLog(`> [FATAL ERROR] ${error.message}`, 'critic');
        } finally {
            submitBtn.disabled = false;
        }
    }

    submitBtn.addEventListener('click', handleQuery);
    
    queryInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleQuery();
        }
    });
});
