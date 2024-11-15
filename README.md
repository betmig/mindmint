# Mind Mint 🌿

A modern meditation app combining traditional Buddhist suttas with accessibility-focused features. Mind Mint helps practitioners deepen their practice through study and contemplation. Built and maintained by [MettaBit](https://mettabit.io).

## Features

### 📖 Sutta Reader
- Authentic Buddhist teachings from dhammatalks.org
- Natural text-to-speech with synchronized highlighting
- Smart phrase detection for natural reading flow
- Random sutta selection from curated collection
- Auto-scrolling text follows the reading

### ⏲️ Meditation Timer
- Customizable duration with hours, minutes, and seconds
- Multiple bell sound options:
  - Tibetan Bowl
  - Zen Bell
  - Meditation Bell
  - Temple Bell
- Configurable start/end meditation bells
- Auto-start option after sutta reading

### 🎯 Accessibility First
- High contrast theme options (Light/Dark)
- Adjustable text highlighting
- Customizable display settings:
  - Brightness (0-100%)
  - Contrast (0-100%)
  - Sepia (0-100%)
  - Grayscale (0-100%)
- Screen reader friendly
- Responsive design for all devices

### 🗣️ Text-to-Speech Options
- Browser-native TTS with voice selection
- Eleven Labs integration with voice preview
- Additional provider support:
  - OpenAI TTS
  - Microsoft Azure
  - Amazon Polly
  - WellSaid Labs

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/mind-mint.git

# Install dependencies
cd mind-mint
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Technology Stack

- React 18 with TypeScript
- Tailwind CSS for styling
- Zustand for state management
- Vite as build tool
- Speech Synthesis API
- Eleven Labs API integration
- Lucide React for icons

## Configuration

### Text-to-Speech

1. Navigate to Settings
2. Select your preferred TTS provider
3. Enter API credentials if using premium providers
4. Choose your preferred voice
5. Test with preview feature

### Display Settings

- Choose between light/dark theme
- Adjust brightness, contrast, sepia, and grayscale
- Customize text highlight color and opacity
- Changes apply in real-time

### Meditation Settings

- Set custom meditation duration
- Choose preferred bell sounds
- Configure bell timing (start/end)
- Enable/disable auto-start after sutta reading

## Privacy

Mind Mint respects your privacy:
- All data stored locally in browser storage
- No analytics or tracking
- No personal information collected
- TTS API keys stored securely in local storage
- No server-side data collection

## Support

This project is funded and maintained by [MettaBit](https://mettabit.io). To support development:

1. Visit [MettaBit PayPal](https://www.paypal.com/paypalme/mettabit)
2. Select "Friends and Family" when sending your contribution
3. Your support helps:
   - Maintain hosting infrastructure
   - Develop new features
   - Provide regular updates
   - Ensure ongoing maintenance

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). This means:

- You can freely use, modify, and distribute this software
- Modified versions must:
  - Use the same license
  - Make source code available
  - Preserve copyright notices
- Server deployments must provide access to source code

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Acknowledgments

- Buddhist texts sourced from dhammatalks.org
- Bell sounds recorded at various temples
- Icons provided by Lucide React
- UI components styled with Tailwind CSS
- TTS capabilities powered by various providers

## Recent Updates

- Added Eleven Labs TTS integration
- Improved text chunking for natural reading
- Enhanced synchronized highlighting
- Added auto-scrolling during reading
- Improved accessibility settings
- Added support for multiple bell sounds
- Implemented in-memory sutta database

---

Made with ❤️ by [MettaBit](https://mettabit.io)