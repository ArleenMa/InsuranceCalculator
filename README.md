# Insurance Calculator
https://arleenma.github.io/InsuranceCalculator/

A modern, AI-powered insurance calculator web application that helps users calculate insurance coverage and out-of-pocket expenses using both manual calculations and AI-powered natural language processing.

## Features

### 🧮 **Dual Calculation Modes**
- **Manual Mode**: Simple percentage or fixed amount calculations
- **AI Mode**: Complex natural language insurance term processing using Google Gemini 2.0 Flash

### 🤖 **AI-Powered Calculations**
- Parse complex insurance scenarios like:
  - "80% coverage up to $1000, then 60% coverage"
  - "$20 copay and 20% off the rest"
  - "Either a 20% reduction or $100 credit—whichever results in lowest out-of-pocket expense"
- Intelligent decision-making for "either/or" scenarios
- Dynamic JavaScript code generation and execution

### 📊 **Smart Results Display**
- Clear breakdown of insurance amount vs. patient amount
- Automatic validation to ensure amounts sum correctly
- Professional, easy-to-read formatting

### 📝 **History Management**
- Automatic saving of all calculations to browser storage
- View calculation history with timestamps
- Delete individual entries or clear all history
- Persistent across browser sessions

### 🎨 **Modern UI/UX**
- Clean, professional design
- Responsive layout for desktop and mobile
- Intuitive mode switching
- Real-time error messaging
- Loading states and user feedback

## Setup Instructions

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- For AI features: Google API key for Gemini 2.0 Flash

### Installation
1. Download all project files:
   - `index.html`
   - `styles.css`
   - `script.js`

2. Place all files in the same directory

3. Open `index.html` in your web browser

### Getting a Google API Key (For AI Features)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key for use in the application

**Note**: AI features are optional. The calculator works perfectly for simple calculations without an API key.

## Usage Guide

### Manual Mode
1. Enter the initial amount (total cost)
2. Select "Manual Calculation" mode
3. Enter either:
   - **Percentage**: Insurance coverage percentage (without % symbol)
   - **Dollar Amount**: Fixed amount insurance will pay
4. Click "Calculate" to see results

**Example**: 
- Initial Amount: $1000
- Insurance Coverage: 80 (%)
- Result: Insurance pays $800, Patient pays $200

### AI Mode
1. Enter the initial amount (total cost)
2. Select "AI Calculation" mode
3. Enter your Google API key (optional, only needed for AI features)
4. Describe your insurance terms in plain English
5. Click "Calculate" to see results

**Example**:
- Initial Amount: $2000
- Insurance Terms: "80% coverage up to $1000, then 60% coverage"
- Result: Insurance pays $1400, Patient pays $600

### Complex Scenarios Supported
- **Tiered Coverage**: "80% coverage up to $1000, then 60% coverage"
- **Copays**: "$20 copay and 20% off the rest"
- **Conditional Logic**: "Either 20% reduction or $100 credit—whichever is lowest out-of-pocket"
- **Caps and Limits**: "90% coverage with a maximum of $500"
- **Deductibles**: "$100 deductible, then 80% coverage"

## Technical Details

### Architecture
- **Frontend Only**: Pure HTML, CSS, and JavaScript
- **No Backend Required**: All processing happens in the browser
- **Local Storage**: History persisted in browser storage
- **API Integration**: Direct calls to Google Gemini API

### Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Security Features
- Safe code execution environment for AI-generated JavaScript
- Input validation and sanitization
- Rate limiting protection
- Secure API key handling

## Error Handling

The application includes comprehensive error handling for:
- Invalid API keys
- Network connectivity issues
- Malformed insurance terms
- Calculation errors
- Browser storage limitations
- Input validation failures

## Privacy & Data

- **No Data Collection**: No personal information is collected or transmitted
- **Local Storage Only**: Calculation history stored locally in your browser
- **API Key Security**: API keys are not stored permanently
- **No Tracking**: No analytics or tracking scripts

## Troubleshooting

### Common Issues

**AI calculations not working**:
- Verify your Google API key is correct
- Check internet connection
- Ensure insurance terms are clearly described

**History not saving**:
- Check if browser storage is enabled
- Clear browser cache if storage is full
- Ensure you're not in private/incognito mode

**Calculations seem incorrect**:
- Verify input amounts are correct
- Check that insurance terms are clearly stated
- For complex scenarios, try breaking them into simpler terms

### Browser Console
Open browser developer tools (F12) and check the console for detailed error messages.

## Contributing

This is a standalone web application. To modify:
1. Edit the HTML structure in `index.html`
2. Modify styling in `styles.css`
3. Update functionality in `script.js`

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify your API key and internet connection
3. Check browser console for error messages
4. Ensure you're using a supported browser version 
