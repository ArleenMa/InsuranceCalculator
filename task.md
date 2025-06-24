# Insurance Calculator - Task Breakdown

## Phase 1: Basic HTML Structure
- [ ] Create main HTML file (index.html)
- [ ] Set up basic page structure and meta tags
- [ ] Create initial amount input field
- [ ] Create mode toggle (AI/Manual) interface
- [ ] Create AI mode text area for natural language input
- [ ] Create manual mode input fields (percentage and amount)
- [ ] Create API key input field (optional, for AI mode)
- [ ] Create calculate button
- [ ] Create results display area (2 boxes: insurance pays, patient pays)
- [ ] Create history display area below results
- [ ] Create history controls (clear all button)

## Phase 2: CSS Styling & Layout
- [ ] Create main CSS file (styles.css)
- [ ] Style page layout and container structure
- [ ] Style input fields and labels
- [ ] Style mode toggle interface
- [ ] Style calculate button
- [ ] Style results display boxes
- [ ] Style history list area
- [ ] Style history controls
- [ ] Add responsive design considerations
- [ ] Style error message displays
- [ ] Add visual feedback for active/inactive modes

## Phase 3: Core JavaScript Functions
- [ ] Create main JavaScript file (script.js)
- [ ] Set up DOM element references
- [ ] Implement mode toggle functionality
- [ ] Show/hide appropriate input fields based on mode
- [ ] Create input validation functions
- [ ] Create manual calculation logic (percentage and amount)
- [ ] Create results display function
- [ ] Create error message display function

## Phase 4: AI Integration (Gemini API)
- [ ] Set up Gemini API integration structure
- [ ] Create API key validation function
- [ ] Create natural language processing request function
- [ ] Implement dynamic JavaScript code execution from AI response
- [ ] Add error handling for API failures
- [ ] Add error handling for invalid API keys
- [ ] Add error handling for AI parsing failures

## Phase 5: History Management
- [ ] Create local storage functions (save, load, clear)
- [ ] Create history entry structure (initial amount, insurance pays, patient pays)
- [ ] Implement add to history function
- [ ] Implement display history function (most recent first)
- [ ] Create individual delete history entry function
- [ ] Create clear all history function
- [ ] Update history display after each calculation

## Phase 6: Error Handling & Validation
- [ ] Implement discount exceeds original amount validation
- [ ] Add comprehensive input validation
- [ ] Create user-friendly error messages
- [ ] Add try-catch blocks for critical functions
- [ ] Test edge cases and error scenarios

## Phase 7: Integration & Testing
- [ ] Integrate all components together
- [ ] Test manual calculation mode
- [ ] Test AI calculation mode with various inputs
- [ ] Test history functionality (add, delete, clear)
- [ ] Test error handling scenarios
- [ ] Test with invalid API keys
- [ ] Test local storage persistence across browser sessions

## Phase 8: Final Touches & Optimization
- [ ] Code cleanup and optimization
- [ ] Add comments and documentation
- [ ] Final UI/UX improvements
- [ ] Cross-browser compatibility testing
- [ ] Performance optimization
- [ ] Security considerations review

## Test Cases to Verify:
### Manual Mode:
- [ ] Simple percentage calculation
- [ ] Simple amount calculation
- [ ] Error when discount exceeds original amount

### AI Mode:
- [ ] "80% coverage up to $1000, then 60% coverage"
- [ ] "$20 copay and 20% off the rest"
- [ ] "either a 20% reduction in service fees or a $100 credit—whichever option results in the lowest out-of-pocket expense"
- [ ] Invalid API key handling
- [ ] API unavailable handling

### History:
- [ ] Save calculations to local storage
- [ ] Display history correctly
- [ ] Delete individual entries
- [ ] Clear all entries
- [ ] Persist across browser sessions 