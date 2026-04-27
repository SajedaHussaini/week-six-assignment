# week-six-assignment

Goal Tracker Application

📌 Overview

The Goal Tracker Application is a web-based project developed using React.
Its purpose is to help users set personal goals, monitor their progress, and stay consistent through visual feedback and simple tracking tools.

This project demonstrates the use of modern front-end technologies, including state management, form validation, and responsive UI design.


Features

- Create, edit, mark progress, pause/resume, and delete goals with confirm dialog
- Track progress based on defined targets
- Organize goals by categories
- Filter and search goals efficiently
- View active, completed, and paused goals
- Dashboard with key statistics (completion rate, streak, XP)
- Visual charts for progress analysis
- Export data (JSON and CSV formats)
- Notification system (goal completion and deadlines)
- Multi-language support (English and Persian)
- RTL and LTR layout support
- Dark mode and light mode UI
- Profile Menu


How to Run the Project

1. Install dependencies:

npm install

2. Start the development server:

npm run dev

3. Open the application in your browser:

http://localhost:5173



Language Support (RTL / LTR)

The application supports both Left-to-Right (LTR) and Right-to-Left (RTL) languages.

- English is displayed in LTR format
- Persian (Farsi) is displayed in RTL format

The layout dynamically adjusts based on the selected language using a localization context ("LocaleContext").
This includes text alignment, component direction, and overall UI structure.



Streak System

The streak feature is designed to encourage user consistency.

Rules:

- If the user completes at least one goal in a day, the streak increases by 1
- If no goals are completed on a given day, the streak resets to 0
- The current streak is displayed on the dashboard


XP (Experience Points) System

The XP system introduces gamification to increase user engagement.

Rules:

- Completing a goal awards XP
- Incrementing progress provides smaller XP rewards
- Continuous activity results in higher XP accumulation

XP is displayed on the dashboard as a measure of user activity and progress.



Technologies Used

- React (Functional Components & Hooks)
- Material UI (MUI) for UI components
- Context API for state management
- React Hook Form for form handling
- Yup for validation schemas
- Vite for project setup and development


📁 Project Structure

src/
 ├──api              # fake backend (using localStorage)
 ├── components/     # Reusable UI components
 ├── pages/          # Main application pages
 ├── context/        # Global state management
 ├── i18n            # Language management
 ├── utils/          # Helper functions
 ├── routes          # rounting the pages
 ├── theme           # theme of the app
 ├── validation/     # Form validation schemas
 └── assets/         # Images and static files


Notes

- This project uses local state (no backend integration)
- The focus is on front-end development and user experience
- All features are implemented with scalability and readability in mind


📸Screenshots

<img src="/src/assets/one.png" width="700" />
<img src="/src/assets/two.png" width="700" />
<img src="/src/assets/three.png" width="700" />
<img src="/src/assets/four.png" width="700" />
<img src="/src/assets/five.png" width="700" />
<img src="/src/assets/six.png" width="700" />
<img src="/src/assets/seven.png" width="700" />
<img src="/src/assets/eight.png" width="700" />
<img src="/src/assets/nine.png" width="700" />
<img src="/src/assets/ten.png" width="700" />
<img src="/src/assets/eleven.png" width="700" />
<img src="/src/assets/twelve.png" width="700" />
<img src="/src/assets/thirtheen.png" width="700" />
<img src="/src/assets/fourtheen.png" width="700" />
<img src="/src/assets/fiftheen.png" width="700" />
<img src="/src/assets/sixtheen.png" width="700" />
<img src="/src/assets/seventheen.png" width="700" />


Mobile Screenshots
Note: due to the limitation of the mobile which can not take screenshot from the entire page, the app screnshots are not been seen completely. but there is a deployed link and you can watch and try it in both mobile and computer devices to ensure yourself the responsive version for mobile.

<img src="/src/assets/eighteen.jpeg" width="300" />
<img src="/src/assets/ninetheen.jpeg" width="300" />
<img src="/src/assets/twenty.jpeg" width="300" />
<img src="/src/assets/twentyOne.jpeg" width="300" />
<img src="/src/assets/twentyTwo.jpeg" width="300" />
<img src="/src/assets/twentyThree.jpeg" width="300" />
<img src="/src/assets/twentyFour.jpeg" width="300" />
<img src="/src/assets/twentyFive.jepg" width="300" />
<img src="/src/assets/twentySix.jpeg" width="300" />