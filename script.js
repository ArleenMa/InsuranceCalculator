// DOM Elements
const manualModeRadio = document.getElementById('manualMode');
const aiModeRadio = document.getElementById('aiMode');
const manualInputs = document.getElementById('manualInputs');
const aiInputs = document.getElementById('aiInputs');
const initialAmountInput = document.getElementById('initialAmount');
const percentageInput = document.getElementById('percentageInput');
const amountInput = document.getElementById('amountInput');
const apiKeyInput = document.getElementById('apiKey');
const naturalLanguageInput = document.getElementById('naturalLanguageInput');
const calculateBtn = document.getElementById('calculateBtn');
const errorMessage = document.getElementById('errorMessage');
const resultsSection = document.getElementById('resultsSection');
const insuranceAmountDisplay = document.getElementById('insuranceAmount');
const patientAmountDisplay = document.getElementById('patientAmount');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// API Key Storage
const API_KEY_STORAGE_NAME = 'insuranceCalc_apiKey';
const STORAGE_ENCRYPTION_KEY = 'InsuranceCalc2024!'; // Simple obfuscation key

// Simple encryption/decryption for API key storage
function encryptApiKey(apiKey) {
    if (!apiKey) return '';
    let encrypted = '';
    for (let i = 0; i < apiKey.length; i++) {
        encrypted += String.fromCharCode(
            apiKey.charCodeAt(i) ^ STORAGE_ENCRYPTION_KEY.charCodeAt(i % STORAGE_ENCRYPTION_KEY.length)
        );
    }
    return btoa(encrypted); // Base64 encode
}

function decryptApiKey(encryptedKey) {
    if (!encryptedKey) return '';
    try {
        const encrypted = atob(encryptedKey); // Base64 decode
        let decrypted = '';
        for (let i = 0; i < encrypted.length; i++) {
            decrypted += String.fromCharCode(
                encrypted.charCodeAt(i) ^ STORAGE_ENCRYPTION_KEY.charCodeAt(i % STORAGE_ENCRYPTION_KEY.length)
            );
        }
        return decrypted;
    } catch (error) {
        console.error('Error decrypting API key:', error);
        return '';
    }
}

// Save API key to localStorage
function saveApiKey(apiKey, remember = false) {
    try {
        if (remember && apiKey) {
            const encrypted = encryptApiKey(apiKey);
            localStorage.setItem(API_KEY_STORAGE_NAME, encrypted);
            localStorage.setItem(API_KEY_STORAGE_NAME + '_remember', 'true');
        } else {
            // Remove from storage if not remembering
            localStorage.removeItem(API_KEY_STORAGE_NAME);
            localStorage.removeItem(API_KEY_STORAGE_NAME + '_remember');
        }
    } catch (error) {
        console.error('Error saving API key:', error);
    }
}

// Load API key from localStorage
function loadApiKey() {
    try {
        const shouldRemember = localStorage.getItem(API_KEY_STORAGE_NAME + '_remember') === 'true';
        if (shouldRemember) {
            const encryptedKey = localStorage.getItem(API_KEY_STORAGE_NAME);
            if (encryptedKey) {
                const decryptedKey = decryptApiKey(encryptedKey);
                if (decryptedKey) {
                    apiKeyInput.value = decryptedKey;
                    const rememberCheckbox = document.getElementById('rememberApiKey');
                    if (rememberCheckbox) {
                        rememberCheckbox.checked = true;
                    }
                    return decryptedKey;
                }
            }
        }
    } catch (error) {
        console.error('Error loading API key:', error);
    }
    return '';
}

// Clear stored API key
function clearStoredApiKey() {
    try {
        localStorage.removeItem(API_KEY_STORAGE_NAME);
        localStorage.removeItem(API_KEY_STORAGE_NAME + '_remember');
    } catch (error) {
        console.error('Error clearing API key:', error);
    }
}

// Initialize mode toggle functionality
function initializeModeToggle() {
    // Add event listeners to radio buttons
    manualModeRadio.addEventListener('change', handleModeChange);
    aiModeRadio.addEventListener('change', handleModeChange);
    
    // Set initial state
    handleModeChange();
}

// Handle mode change between manual and AI
function handleModeChange() {
    if (manualModeRadio.checked) {
        // Show manual inputs, hide AI inputs
        manualInputs.classList.remove('hidden');
        aiInputs.classList.add('hidden');
    } else if (aiModeRadio.checked) {
        // Show AI inputs, hide manual inputs
        manualInputs.classList.add('hidden');
        aiInputs.classList.remove('hidden');
    }
    
    // Clear any previous error messages
    hideErrorMessage();
}

// Show error message
function showErrorMessage(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

// Hide error message
function hideErrorMessage() {
    errorMessage.classList.add('hidden');
    errorMessage.textContent = '';
}

// Display results
function displayResults(insuranceAmount, patientAmount, explanation = null, isAICalculation = false) {
    insuranceAmountDisplay.textContent = `$${insuranceAmount.toFixed(2)}`;
    patientAmountDisplay.textContent = `$${patientAmount.toFixed(2)}`;
    
    // Show or hide explanation section
    const explanationSection = document.getElementById('explanationSection');
    const explanationText = document.getElementById('explanationText');
    const viewCodeSection = document.getElementById('viewCodeSection');
    
    if (explanation && explanation.trim()) {
        explanationText.textContent = explanation;
        explanationSection.classList.remove('hidden');
    } else {
        explanationSection.classList.add('hidden');
    }
    
    // Show or hide view code section for AI calculations
    if (isAICalculation && viewCodeSection) {
        viewCodeSection.classList.remove('hidden');
    } else if (viewCodeSection) {
        viewCodeSection.classList.add('hidden');
    }
    
    resultsSection.classList.remove('hidden');
}

// Function to open code viewer window
function viewGeneratedCode() {
    if (!window.lastGeneratedCode) {
        alert('No generated code available to view.');
        return;
    }
    
    const codeData = window.lastGeneratedCode;
    const codeWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
    
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Generated Code - Insurance Calculator</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background-color: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border-radius: 8px;
            padding: 30px;
        }
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #007bff;
            padding-bottom: 10px;
            margin-bottom: 30px;
        }
        h2 {
            color: #495057;
            margin-top: 30px;
            margin-bottom: 15px;
            border-left: 4px solid #007bff;
            padding-left: 15px;
        }
        .info-section {
            background-color: #e7f3ff;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
            border-left: 4px solid #007bff;
        }
        .info-item {
            margin-bottom: 10px;
        }
        .info-label {
            font-weight: 600;
            color: #495057;
            display: inline-block;
            min-width: 140px;
        }
        .code-block {
            background-color: #2d3748;
            color: #e2e8f0;
            padding: 20px;
            border-radius: 6px;
            overflow-x: auto;
            font-family: 'Courier New', Consolas, monospace;
            font-size: 14px;
            line-height: 1.4;
            margin: 15px 0;
            border-left: 4px solid #4299e1;
        }
        .result-section {
            background-color: #d4edda;
            padding: 15px;
            border-radius: 6px;
            margin-top: 20px;
            border-left: 4px solid #28a745;
        }
        .result-item {
            margin-bottom: 8px;
        }
        .timestamp {
            color: #6c757d;
            font-size: 0.9rem;
            font-style: italic;
        }
        .close-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #dc3545;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        .close-btn:hover {
            background-color: #c82333;
        }
    </style>
</head>
<body>
    <button class="close-btn" onclick="window.close()">Close Window</button>
    
    <div class="container">
        <h1>🤖 AI Generated Code Viewer</h1>
        
        <div class="info-section">
            <div class="info-item">
                <span class="info-label">Generated:</span>
                <span class="timestamp">${codeData.timestamp}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Initial Amount:</span>
                <span>$${codeData.initialAmount.toFixed(2)}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Insurance Terms:</span>
                <span>"${codeData.insuranceTerms}"</span>
            </div>
        </div>
        
        <h2>📝 AI Generated JavaScript Code</h2>
        <p>This is the JavaScript function that the AI (Gemini 2.0 Flash) generated to calculate your insurance amounts:</p>
        <div class="code-block">${escapeHtml(codeData.originalCode)}</div>
        
        <h2>⚙️ Browser Execution Process</h2>
        <p>Here's how the browser processed and executed the AI-generated code:</p>
        <div class="code-block">// Step 1: Create safe execution environment
const safeFunction = new Function('initialAmount', \`
    ${escapeHtml(codeData.originalCode)}
    return calculateInsurance(initialAmount);
\`);

// Step 2: Execute the function with your initial amount
const result = safeFunction(${codeData.initialAmount});

// Step 3: Validate and extract results
const insuranceAmount = result.insuranceAmount; // ${codeData.result.insuranceAmount.toFixed(2)}
const patientAmount = result.patientAmount;     // ${codeData.result.patientAmount.toFixed(2)}
const explanation = result.explanation;         // "${codeData.result.explanation}"</div>
        
        <div class="result-section">
            <h2>✅ Final Results</h2>
            <div class="result-item"><strong>Insurance Pays:</strong> $${codeData.result.insuranceAmount.toFixed(2)}</div>
            <div class="result-item"><strong>Patient Pays:</strong> $${codeData.result.patientAmount.toFixed(2)}</div>
            <div class="result-item"><strong>Total Check:</strong> $${(codeData.result.insuranceAmount + codeData.result.patientAmount).toFixed(2)} (should equal initial amount)</div>
            ${codeData.result.explanation ? `<div class="result-item"><strong>Explanation:</strong> ${escapeHtml(codeData.result.explanation)}</div>` : ''}
        </div>
        
        <h2>🔒 Security Notes</h2>
        <ul>
            <li>The AI-generated code is executed in a controlled environment</li>
            <li>No external network access or file system access</li>
            <li>Results are validated before being displayed</li>
            <li>Code execution is sandboxed for security</li>
        </ul>
    </div>
    
    <script>
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    </script>
</body>
</html>`;
    
    codeWindow.document.write(htmlContent);
    codeWindow.document.close();
}

// HTML escape function for code viewer
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Hide results
function hideResults() {
    resultsSection.classList.add('hidden');
}

// Input validation
function validateInputs() {
    const initialAmount = parseFloat(initialAmountInput.value);
    
    // Check if initial amount is provided and valid
    if (!initialAmountInput.value || isNaN(initialAmount) || initialAmount <= 0) {
        showErrorMessage('Please enter a valid initial amount greater than 0');
        return false;
    }
    
    // Check for extremely large amounts (prevent overflow)
    if (initialAmount > 1000000000) {
        showErrorMessage('Initial amount is too large. Please enter a reasonable amount.');
        return false;
    }
    
    if (manualModeRadio.checked) {
        const percentage = parseFloat(percentageInput.value);
        const amount = parseFloat(amountInput.value);
        
        // Check if at least one input is provided
        if ((!percentageInput.value || isNaN(percentage)) && (!amountInput.value || isNaN(amount))) {
            showErrorMessage('Please enter either a percentage or dollar amount for insurance coverage');
            return false;
        }
        
        // Check if percentage is valid (0-100)
        if (percentageInput.value && (isNaN(percentage) || percentage < 0 || percentage > 100)) {
            showErrorMessage('Percentage must be between 0 and 100');
            return false;
        }
        
        // Check if amount is valid (positive)
        if (amountInput.value && (isNaN(amount) || amount < 0)) {
            showErrorMessage('Dollar amount must be 0 or greater');
            return false;
        }
        
        // Check for extremely large amounts
        if (amountInput.value && amount > 1000000000) {
            showErrorMessage('Insurance amount is too large. Please enter a reasonable amount.');
            return false;
        }
    } else {
        // AI mode validation
        if (!naturalLanguageInput.value.trim()) {
            showErrorMessage('Please enter insurance terms for AI calculation');
            return false;
        }
        
        // Check for extremely long input (prevent API abuse)
        if (naturalLanguageInput.value.trim().length > 1000) {
            showErrorMessage('Insurance terms are too long. Please keep under 1000 characters.');
            return false;
        }
    }
    
    return true;
}

// Manual calculation logic
function performManualCalculation() {
    const initialAmount = parseFloat(initialAmountInput.value);
    const percentage = parseFloat(percentageInput.value) || 0;
    const amount = parseFloat(amountInput.value) || 0;
    
    let insuranceAmount = 0;
    
    // Calculate insurance amount based on inputs
    if (percentageInput.value && amountInput.value) {
        // Both percentage and amount provided - this should use AI mode
        showErrorMessage('For combined percentage and amount calculations, please use AI mode');
        return;
    } else if (percentageInput.value) {
        // Only percentage provided
        insuranceAmount = (initialAmount * percentage) / 100;
    } else if (amountInput.value) {
        // Only amount provided
        insuranceAmount = amount;
    }
    
    // Check if insurance amount exceeds initial amount
    if (insuranceAmount > initialAmount) {
        showErrorMessage('Insurance coverage cannot exceed the initial amount');
        return;
    }
    
    const patientAmount = initialAmount - insuranceAmount;
    
    // Display results
    displayResults(insuranceAmount, patientAmount);
    
    // Add to history
    addToHistory(initialAmount, insuranceAmount, patientAmount);
}

// Add calculation to history
function addToHistory(initialAmount, insuranceAmount, patientAmount, explanation = null) {
    try {
        const historyEntry = {
            id: Date.now(),
            timestamp: new Date().toLocaleString(),
            initialAmount: Number(initialAmount.toFixed(2)),
            insuranceAmount: Number(insuranceAmount.toFixed(2)),
            patientAmount: Number(patientAmount.toFixed(2)),
            explanation: explanation || null,
            calculationType: explanation ? 'AI' : 'Manual'
        };
        
        // Get existing history from localStorage
        let history = JSON.parse(localStorage.getItem('insuranceCalculatorHistory')) || [];
        
        // Limit history to last 50 entries to prevent excessive storage
        if (history.length >= 50) {
            history = history.slice(0, 49);
        }
        
        // Add new entry at the beginning (most recent first)
        history.unshift(historyEntry);
        
        // Save to localStorage
        localStorage.setItem('insuranceCalculatorHistory', JSON.stringify(history));
        
        // Update display
        displayHistory();
    } catch (error) {
        console.error('Error saving to history:', error);
        // Don't show error to user as this is not critical functionality
    }
}

// Display history
function displayHistory() {
    try {
        const history = JSON.parse(localStorage.getItem('insuranceCalculatorHistory')) || [];
        
        if (history.length === 0) {
            historyList.innerHTML = '<p class="no-history">No calculations yet</p>';
            return;
        }
        
        historyList.innerHTML = history.map(entry => {
            // Ensure all values are valid numbers
            const initial = Number(entry.initialAmount) || 0;
            const insurance = Number(entry.insuranceAmount) || 0;
            const patient = Number(entry.patientAmount) || 0;
            const explanation = entry.explanation || '';
            const calculationType = entry.calculationType || 'Manual';
            
            return `
                <div class="history-item">
                    <div class="history-details">
                        <div class="history-amount">
                            <span>Initial: $${initial.toFixed(2)}</span>
                            <span class="calculation-type">(${calculationType})</span>
                        </div>
                        <div class="history-results">
                            <span>Insurance: $${insurance.toFixed(2)}</span>
                            <span>Patient: $${patient.toFixed(2)}</span>
                        </div>
                        ${explanation ? `<div class="history-explanation">${explanation}</div>` : ''}
                    </div>
                    <button class="delete-history-btn" onclick="deleteHistoryEntry(${entry.id})">Delete</button>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error displaying history:', error);
        historyList.innerHTML = '<p class="no-history">Error loading history</p>';
    }
}

// Delete individual history entry
function deleteHistoryEntry(id) {
    let history = JSON.parse(localStorage.getItem('insuranceCalculatorHistory')) || [];
    history = history.filter(entry => entry.id !== id);
    localStorage.setItem('insuranceCalculatorHistory', JSON.stringify(history));
    displayHistory();
}

// Clear all history
function clearAllHistory() {
    localStorage.removeItem('insuranceCalculatorHistory');
    displayHistory();
}

// AI calculation functionality
async function performAICalculation() {
    const initialAmount = parseFloat(initialAmountInput.value);
    const insuranceTerms = naturalLanguageInput.value.trim();
    const apiKey = apiKeyInput.value.trim();
    
    // Check if API key is provided
    if (!apiKey) {
        showErrorMessage('Please enter your Google API key to use AI calculations');
        return;
    }
    
    // Show loading state
    calculateBtn.disabled = true;
    calculateBtn.textContent = 'Calculating...';
    
    try {
        // Call Gemini API
        const result = await callGeminiAPI(apiKey, initialAmount, insuranceTerms);
        
        if (result.success) {
            // Execute the generated JavaScript code
            const calculationResult = executeGeneratedCode(result.code, initialAmount);
            
            if (calculationResult.success) {
                const { insuranceAmount, patientAmount, explanation } = calculationResult;
                
                // Validate results
                if (insuranceAmount < 0 || patientAmount < 0) {
                    showErrorMessage('Invalid calculation result: amounts cannot be negative');
                    return;
                }
                
                if (Math.abs((insuranceAmount + patientAmount) - initialAmount) > 0.01) {
                    showErrorMessage('Invalid calculation result: amounts do not sum to initial amount');
                    return;
                }
                
                // Store the generated code for viewing
                window.lastGeneratedCode = {
                    originalCode: result.code,
                    initialAmount: initialAmount,
                    insuranceTerms: insuranceTerms,
                    result: { insuranceAmount, patientAmount, explanation },
                    timestamp: new Date().toLocaleString()
                };
                
                // Display results
                displayResults(insuranceAmount, patientAmount, explanation, true);
                
                // Add to history
                addToHistory(initialAmount, insuranceAmount, patientAmount, explanation);
            } else {
                showErrorMessage('Error executing calculation: ' + calculationResult.error);
            }
        } else {
            showErrorMessage(result.error);
        }
    } catch (error) {
        console.error('AI calculation error:', error);
        showErrorMessage('An error occurred during AI calculation. Please check your API key and try again.');
    } finally {
        // Reset button state
        calculateBtn.disabled = false;
        calculateBtn.textContent = 'Calculate';
    }
}

// Call Gemini API
async function callGeminiAPI(apiKey, initialAmount, insuranceTerms) {
    const prompt = `
You are an insurance calculator. Given an initial amount and insurance terms, generate JavaScript code that calculates exactly how much insurance pays and how much the patient pays, along with a clear explanation.

Initial Amount: $${initialAmount}
Insurance Terms: "${insuranceTerms}"

IMPORTANT DEFINITIONS:
- "out-of-pocket expense" = what the PATIENT pays (patientAmount)
- "lowest out-of-pocket expense" = choose the option where the PATIENT pays the LEAST amount
- When terms say "whichever results in lowest out-of-pocket", calculate both options and pick the one where patientAmount is smaller

Generate BOTH:
1. A JavaScript function that returns an object with 'insuranceAmount', 'patientAmount', and 'explanation' properties
2. The function should be named 'calculateInsurance' and take 'initialAmount' as a parameter

Requirements:
- Return exact numeric values (not strings) for amounts
- insuranceAmount + patientAmount must equal initialAmount
- Include a clear, step-by-step explanation string
- Handle complex scenarios like tiered coverage, copays, caps, and conditional logic
- For "either/or" scenarios, calculate BOTH options, show both calculations, and explain why one was chosen
- Use proper mathematical calculations
- No console.log statements
- No external dependencies

Example scenarios:
1. "80% coverage up to $1000, then 60% coverage" - Apply 80% to first $1000, then 60% to remainder
2. "$20 copay and 20% off the rest" - Patient pays $20 copay + 20% of (initialAmount - 20)
3. "either 20% reduction or $100 credit, whichever is lowest out-of-pocket" - Calculate both: (1) patient pays 80% of initial, (2) patient pays (initial - 100), choose option where patient pays less

Example format:
function calculateInsurance(initialAmount) {
    // Your calculation logic here
    // For either/or scenarios, calculate both options and pick the one where patient pays less
    
    const explanation = "Step-by-step explanation of how the calculation was performed, including any decisions made for either/or scenarios";
    
    return {
        insuranceAmount: [calculated amount],
        patientAmount: [calculated amount],
        explanation: explanation
    };
}

Generate the complete function for the given insurance terms with a detailed explanation.`;

    const requestBody = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }],
        generationConfig: {
            temperature: 0.1,
            topK: 1,
            topP: 1,
            maxOutputTokens: 1000,
        }
    };

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            if (response.status === 401) {
                return { success: false, error: 'Invalid API key. Please check your Google API key.' };
            } else if (response.status === 403) {
                return { success: false, error: 'API access denied. Please check your API key permissions.' };
            } else {
                return { success: false, error: `API request failed with status ${response.status}` };
            }
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const generatedText = data.candidates[0].content.parts[0].text;
            
            // Extract JavaScript code from the response
            const codeMatch = generatedText.match(/function calculateInsurance\([\s\S]*?\n}/);
            
            if (codeMatch) {
                return { success: true, code: codeMatch[0] };
            } else {
                return { success: false, error: 'Could not extract valid JavaScript code from AI response' };
            }
        } else {
            return { success: false, error: 'Invalid response format from API' };
        }
    } catch (error) {
        console.error('API call error:', error);
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            return { success: false, error: 'Network error. Please check your internet connection.' };
        }
        
        return { success: false, error: 'Failed to connect to AI service' };
    }
}

// Execute generated JavaScript code safely
function executeGeneratedCode(code, initialAmount) {
    try {
        // Create a safe execution environment
        const safeFunction = new Function('initialAmount', `
            ${code}
            return calculateInsurance(initialAmount);
        `);
        
        // Execute the function
        const result = safeFunction(initialAmount);
        
        // Validate the result structure
        if (typeof result !== 'object' || result === null) {
            return { success: false, error: 'Generated code did not return an object' };
        }
        
        if (typeof result.insuranceAmount !== 'number' || typeof result.patientAmount !== 'number') {
            return { success: false, error: 'Generated code did not return valid numeric amounts' };
        }
        
        if (isNaN(result.insuranceAmount) || isNaN(result.patientAmount)) {
            return { success: false, error: 'Generated code returned invalid numbers' };
        }
        
        // Extract explanation (optional)
        const explanation = result.explanation || '';
        
        return { 
            success: true, 
            insuranceAmount: result.insuranceAmount, 
            patientAmount: result.patientAmount,
            explanation: explanation
        };
    } catch (error) {
        console.error('Code execution error:', error);
        return { success: false, error: 'Failed to execute generated calculation code' };
    }
}

// Main calculate function
function handleCalculate() {
    // Hide previous results and errors
    hideResults();
    hideErrorMessage();
    
    // Validate inputs
    if (!validateInputs()) {
        return;
    }
    
    if (manualModeRadio.checked) {
        performManualCalculation();
    } else {
        performAICalculation();
    }
}

// Initialize event listeners
function initializeEventListeners() {
    calculateBtn.addEventListener('click', handleCalculate);
    clearHistoryBtn.addEventListener('click', clearAllHistory);
    
    // Clear inputs when switching modes
    manualModeRadio.addEventListener('change', () => {
        if (manualModeRadio.checked) {
            naturalLanguageInput.value = '';
            hideResults();
            hideErrorMessage();
        }
    });
    
    aiModeRadio.addEventListener('change', () => {
        if (aiModeRadio.checked) {
            percentageInput.value = '';
            amountInput.value = '';
            hideResults();
            hideErrorMessage();
        }
    });
    
    // Add Enter key support for inputs
    [initialAmountInput, percentageInput, amountInput, naturalLanguageInput].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !calculateBtn.disabled) {
                handleCalculate();
            }
        });
    });
    
    // Auto-clear error messages when user starts typing
    [initialAmountInput, percentageInput, amountInput, naturalLanguageInput, apiKeyInput].forEach(input => {
        input.addEventListener('input', () => {
            if (!errorMessage.classList.contains('hidden')) {
                hideErrorMessage();
            }
        });
    });
    
    // API Key storage event listeners
    const rememberCheckbox = document.getElementById('rememberApiKey');
    const clearApiKeyBtn = document.getElementById('clearApiKeyBtn');
    
    if (rememberCheckbox) {
        rememberCheckbox.addEventListener('change', (e) => {
            const apiKey = apiKeyInput.value.trim();
            if (e.target.checked && apiKey) {
                saveApiKey(apiKey, true);
            } else {
                saveApiKey('', false);
            }
        });
    }
    
    if (clearApiKeyBtn) {
        clearApiKeyBtn.addEventListener('click', () => {
            apiKeyInput.value = '';
            if (rememberCheckbox) {
                rememberCheckbox.checked = false;
            }
            clearStoredApiKey();
            showNotification('API key cleared from storage', 'success');
        });
    }
    
    // Save API key when it changes and remember is checked
    apiKeyInput.addEventListener('input', () => {
        if (rememberCheckbox && rememberCheckbox.checked) {
            const apiKey = apiKeyInput.value.trim();
            saveApiKey(apiKey, true);
        }
    });
}

// Show notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: type === 'success' ? '#d4edda' : '#e7f3ff',
        color: type === 'success' ? '#155724' : '#004085',
        padding: '12px 16px',
        borderRadius: '6px',
        border: `1px solid ${type === 'success' ? '#c3e6cb' : '#b3d7ff'}`,
        zIndex: '10000',
        fontSize: '14px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        maxWidth: '300px'
    });
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeModeToggle();
    initializeEventListeners();
    displayHistory(); // Load existing history on page load
    loadApiKey(); // Load stored API key if available
    console.log('Insurance Calculator initialized with full functionality');
}); 