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
function displayResults(insuranceAmount, patientAmount) {
    insuranceAmountDisplay.textContent = `$${insuranceAmount.toFixed(2)}`;
    patientAmountDisplay.textContent = `$${patientAmount.toFixed(2)}`;
    resultsSection.classList.remove('hidden');
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
function addToHistory(initialAmount, insuranceAmount, patientAmount) {
    try {
        const historyEntry = {
            id: Date.now(),
            timestamp: new Date().toLocaleString(),
            initialAmount: Number(initialAmount.toFixed(2)),
            insuranceAmount: Number(insuranceAmount.toFixed(2)),
            patientAmount: Number(patientAmount.toFixed(2))
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
            
            return `
                <div class="history-item">
                    <div class="history-details">
                        <div class="history-amount">Initial: $${initial.toFixed(2)}</div>
                        <div class="history-results">
                            <span>Insurance: $${insurance.toFixed(2)}</span>
                            <span>Patient: $${patient.toFixed(2)}</span>
                        </div>
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
                const { insuranceAmount, patientAmount } = calculationResult;
                
                // Validate results
                if (insuranceAmount < 0 || patientAmount < 0) {
                    showErrorMessage('Invalid calculation result: amounts cannot be negative');
                    return;
                }
                
                if (Math.abs((insuranceAmount + patientAmount) - initialAmount) > 0.01) {
                    showErrorMessage('Invalid calculation result: amounts do not sum to initial amount');
                    return;
                }
                
                // Display results
                displayResults(insuranceAmount, patientAmount);
                
                // Add to history
                addToHistory(initialAmount, insuranceAmount, patientAmount);
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
You are an insurance calculator. Given an initial amount and insurance terms, generate JavaScript code that calculates exactly how much insurance pays and how much the patient pays.

Initial Amount: $${initialAmount}
Insurance Terms: "${insuranceTerms}"

IMPORTANT DEFINITIONS:
- "out-of-pocket expense" = what the PATIENT pays (patientAmount)
- "lowest out-of-pocket expense" = choose the option where the PATIENT pays the LEAST amount
- When terms say "whichever results in lowest out-of-pocket", calculate both options and pick the one where patientAmount is smaller

Generate ONLY a JavaScript function that returns an object with 'insuranceAmount' and 'patientAmount' properties. The function should be named 'calculateInsurance' and take 'initialAmount' as a parameter.

Requirements:
- Return exact numeric values (not strings)
- insuranceAmount + patientAmount must equal initialAmount
- Handle complex scenarios like tiered coverage, copays, caps, and conditional logic
- For "either/or" scenarios, calculate BOTH options and choose the one where patientAmount is LOWER
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
    return {
        insuranceAmount: [calculated amount],
        patientAmount: [calculated amount]
    };
}

Generate the complete function for the given insurance terms.`;

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
        
        return { 
            success: true, 
            insuranceAmount: result.insuranceAmount, 
            patientAmount: result.patientAmount 
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
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeModeToggle();
    initializeEventListeners();
    displayHistory(); // Load existing history on page load
    console.log('Insurance Calculator initialized with full functionality');
}); 