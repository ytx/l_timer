# Timer for Lecture

A timer application designed to manage lecture sessions and breaks during training programs.
When you're focused on lecturing, it's easy to forget about breaks, so this app notifies you with sound to encourage appropriate rest periods.
I created this after receiving feedback in post-lecture surveys about insufficient breaks.
After implementation, survey results improved for both in-person and online training sessions.

You can launch it directly from https://xpenguin.biz/l_timer/
All data is stored in the browser's LocalStorage and never sent to a server, so you can use it with confidence.

All code is written by Claude Code. I barely reviewed the implementation.
I'm building what I need, and have tested it on Chrome for Windows/macOS only.
While I'm not planning to make it overly feature-rich, I'm open to considering feature requests.
The content below was automatically written by Claude Code and might sound a bit exaggerated, but it's mostly accurate.

## Main Features

### ⏰ Timer Functionality
- **50-min lecture + 10/60-min break** default settings
- **1-minute granular time adjustment** (Lecture: 1-300 min, Break: 1-120 min)
- **Overtime support**: Continues counting up after lecture ends
- **Auto-transition**: Automatically starts lecture after break ends
- **Custom end time**: Adjust end time in real-time (-10/-1/+1/+10 min)
- **Countdown timer**: Automatically calculates remaining time from custom end time

### 🔊 Audio System
- **3 sound types** × **3 variations**:
  - Warning sound: Pre-lecture warning (default 3 min before, adjustable 1-10 min)
  - End sound: Session completion notification
  - Overtime sound: Periodic sound during overtime (default 60 sec interval, adjustable 10-300 sec)
- **Volume control**: 0-100% slider
- **Quick mute**: Toggle mute instantly with 🔊/🔇 button
- **Auto-unmute**: Automatically unmutes when lecture/break starts
- **Test playback**: Preview each sound in settings

### 🎨 User Interface
- **Responsive design**: Mobile and desktop support
- **Dark mode/Light mode**: Toggle with 🌙/☀️ button
- **Fullscreen support**: Presentation mode with ⛶ button
- **Flat design**: Clean UI with removed timer borders and shadows
- **SVG icons**: Wrench (settings), pen (editor), speaker (mute), etc.
- **Color themes**:
  - During lecture: Blue tones
  - During break: Green tones
  - Overtime: Red tones
- **Dynamic layout**:
  - Timer font size smoothly adjusts to screen width
  - Progress bar automatically sized to match 7-digit monospace font width
  - Timer size responds to editor/timer ratio changes
- **Icon buttons**: Unified design
  - ☕ Start break (10 min)
  - 🍽️ Start lunch break (60 min)
  - 📚 Start lecture (during break)
  - 💤 Stop

### ⚙️ Settings
- **Time settings**:
  - Lecture time (1-300 min)
  - Break time (1-120 min)
  - Lunch break time (1-120 min)
  - Warning timing (1-10 min)
  - Overtime interval (10-300 sec)
- **Sound selection**: Choose from each sound type
- **Auto-save**: All settings saved to LocalStorage
- **Settings restoration**: Restore previous settings on startup

### 📝 Editor Features
- **WYSIWYG Editor**: Rich text editor based on Quill.js
- **Split screen**: Timer and editor side-by-side, drag to resize
- **Dynamic resize**: Timer font size automatically adjusts when changing editor/timer ratio
- **Document management**: Save, load, and delete multiple notes
- **Zoom functionality**: Scale editor display from 50%-200%
- **Auto-save**: Documents saved to LocalStorage
- **Auto-title generation**: Automatically generates title from first line

### 💾 Data Management
- **Export**: Export all settings and documents in JSON format
- **Import**: Restore from backup
- **Select all**: Easily copy export data
- **Clear storage**: Delete all data and reset to initial state

### 🌐 Multi-language Support
- **Initial language selection**: Choose Japanese/English on first use
- **Language switching**: Change anytime in settings
- **Full UI coverage**: Labels, buttons, tooltips, dialogs all supported
- **Auto-save**: Language preference is remembered

## Usage

### Basic Operations
1. **Start lecture**: "Start" button or keyboard `L`
2. **Start break**: ☕ or 🍽️ button, or keyboard `B`
3. **Stop**: 💤 button or keyboard `S`/`Escape`
4. **Settings**: ⚙️ button in header to open settings
5. **Editor**: 📝 button in header to show/hide editor

### Adjusting End Time
- Use adjustment buttons displayed below end time during lecture/break
- **-10**: Advance by 10 minutes
- **-1**: Advance by 1 minute
- **+1**: Delay by 1 minute
- **+10**: Delay by 10 minutes

### Keyboard Shortcuts
- `L`: Start lecture
- `B`: Start break
- `S` / `Escape`: Stop timer
- `T`: Toggle theme
- `F`: Toggle fullscreen

## File Structure
```
l_timer/
├── index.html              # Main HTML
├── css/
│   ├── styles.css          # Main stylesheet
│   └── quill.snow.css      # Quill.js theme
├── js/
│   ├── app.js              # Timer application
│   ├── editor.js           # Editor manager
│   ├── document.js         # Document management
│   ├── resizer.js          # Resize manager
│   ├── data-manager.js     # Data export/import
│   └── i18n.js             # Internationalization
├── lib/
│   └── quill.min.js        # Quill.js library
├── audio/                  # Audio files
│   ├── sound1-1.wav        # Warning sound 1
│   ├── sound1-2.wav        # Warning sound 2
│   ├── sound1-3.wav        # Warning sound 3
│   ├── sound2-1.wav        # End sound 1
│   ├── sound2-2.wav        # End sound 2
│   ├── sound2-3.wav        # End sound 3
│   ├── sound3-1.wav        # Overtime sound 1
│   ├── sound3-2.wav        # Overtime sound 2
│   ├── sound3-3.wav        # Overtime sound 3
│   ├── README.md           # Audio file description
│   └── generate_more_sounds.py  # Sound generation script
├── images/
│   └── bmc_qr.png          # Buy Me a Coffee QR code
├── README.md               # README (Japanese)
├── README-en.md            # This file (English)
└── CLAUDE.md               # Implementation summary
```

## Technical Specifications
- **HTML5 Audio API**: Audio playback
- **Quill.js**: WYSIWYG editor
- **CSS Custom Properties**: Theme system
- **CSS Container Queries**: Dynamic layout adjustment when editor is visible
- **CSS clamp()**: Fluid font sizes and layouts
- **LocalStorage**: Settings and document persistence
- **ResizeObserver API**: Responsive layout
- **Responsive Design**: Mobile support
- **Offline Ready**: No internet connection required

## Browser Compatibility
- **Recommended**: Chrome, Edge
- **Supported**: Firefox, Safari (with some limitations)
- **OS**: Windows, macOS, Linux, iOS, Android

## About Audio
- Audio files downloaded from [Mixkit](https://mixkit.co/)
- WAV format for offline playback
- Custom sound generation possible with Python script

## Troubleshooting

### Audio not playing
1. Check browser audio settings
2. Verify 🔊 button is not muted
3. Check volume slider is not at 0
4. Test audio with "Test" button in settings

### Display issues
- Set browser zoom to 100%
- Try fullscreen mode (⛶ button)

### Settings not saved
- Verify browser LocalStorage is enabled
- Settings are not saved in private/incognito mode

For detailed implementation information, refer to `CLAUDE.md`.
