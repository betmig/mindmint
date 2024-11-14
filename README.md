# Mind Mint 🌿

A modern meditation app that combines traditional Buddhist suttas with accessibility-focused features. Mind Mint helps practitioners deepen their practice through study and contemplation.

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

## Technology Stack

- React 18
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- Vite (Build Tool)
- Lucide React Icons
- Speech Synthesis API
- Eleven Labs API Integration

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/betmig/mind-mint.git
```

2. Install dependencies:
```bash
cd mind-mint
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Configuration

### Text-to-Speech Providers

The app supports multiple TTS providers. To use them:

1. Navigate to Settings
2. Select your preferred TTS provider
3. Enter the required API credentials
4. Select your preferred voice
5. Test the voice with the preview feature (Eleven Labs)

### Display Settings

Customize the display:

1. Choose between light/dark theme
2. Adjust brightness, contrast, sepia, and grayscale
3. Customize text highlight color and opacity
4. Changes are applied in real-time

### Meditation Settings

Configure your meditation experience:

1. Set custom meditation duration
2. Choose preferred bell sounds
3. Configure bell timing (start/end)
4. Enable/disable auto-start after sutta reading

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
```bash
git checkout -b feature/amazing-feature
```
3. Commit your changes
```bash
git commit -m 'Add amazing feature'
```
4. Push to the branch
```bash
git push origin feature/amazing-feature
```
5. Open a Pull Request

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0) - see the [LICENSE](LICENSE) file for details.

## Privacy

Mind Mint respects your privacy:
- All data is stored locally in browser storage
- No analytics or tracking
- No personal information collected
- TTS API keys stored securely in local storage
- No server-side data collection

## Features in Development

- Sutta categorization and search
- Custom meditation sequences
- Guided meditation scripts
- Progress tracking
- Community sharing features
- Additional TTS voices and languages
- Mobile app version

## Acknowledgments

- Buddhist texts sourced from dhammatalks.org
- Bell sounds recorded at various temples
- Icons provided by Lucide React
- UI components styled with Tailwind CSS
- TTS capabilities powered by various providers

## Support

For support, please:
1. Check the [Issues](https://github.com/betmig/mind-mint/issues) page
2. Create a new issue if needed
3. Join our community discussions

## Recent Updates

- Added Eleven Labs TTS integration with voice preview
- Improved text chunking for more natural reading
- Enhanced synchronized text highlighting
- Added auto-scrolling during reading
- Improved accessibility settings responsiveness
- Added support for multiple bell sounds
- Implemented in-memory sutta database
- Improved navigation with logo as home link

---

Made with ❤️ for the Dharma community by [@betmig](https://github.com/betmig)