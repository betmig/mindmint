import React from 'react';
import { BookOpen, Scale, Shield } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <BookOpen className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">About Mind Mint</h2>
        </div>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300">
            Mind Mint is a meditation application designed to help practitioners deepen their practice through the study and contemplation of Buddhist suttas. Our platform combines traditional teachings with modern accessibility features, making ancient wisdom more accessible to contemporary practitioners.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            The application offers a unique blend of features including daily suttas, text-to-speech capabilities, and customizable meditation timers. We believe in making meditation and Buddhist teachings accessible to everyone, regardless of their experience level or physical abilities.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Our commitment to accessibility extends beyond content to include customizable interface options, ensuring that practitioners of all abilities can engage with the teachings comfortably.
          </p>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Scale className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">License</h2>
        </div>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300">
            Mind Mint is licensed under the GNU Affero General Public License version 3 (AGPL-3.0 or AGPLv3).
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            This means:
          </p>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
            <li>You can freely use, modify, and distribute this software</li>
            <li>If you modify and share this software, you must:
              <ul className="list-disc pl-6">
                <li>Make your modifications available under the same license</li>
                <li>Preserve copyright notices and license information</li>
                <li>Provide access to the complete source code</li>
              </ul>
            </li>
            <li>If you run a modified version on a server, you must make the complete source code available to users</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300">
            For the complete license text, visit the <a href="https://www.gnu.org/licenses/agpl-3.0.en.html" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-hover">GNU AGPL-3.0 License</a> page.
          </p>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Privacy Policy</h2>
        </div>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300">
            We take your privacy seriously. Mind Mint is designed to respect user privacy and minimize data collection.
          </p>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-4">Data Collection</h3>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
            <li>All data is stored locally in your browser</li>
            <li>No personal information is collected or transmitted</li>
            <li>No analytics or tracking tools are used</li>
            <li>Settings and preferences are saved only on your device</li>
          </ul>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-4">Third-Party Services</h3>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
            <li>Text-to-speech functionality uses your browser's built-in capabilities</li>
            <li>Sutta texts are retrieved from dhammatalks.org</li>
            <li>No third-party analytics or tracking services are used</li>
          </ul>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-4">Data Storage</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Your settings and preferences are stored using browser local storage. You can clear this data at any time by:
          </p>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
            <li>Clearing your browser's local storage</li>
            <li>Using your browser's privacy/incognito mode</li>
            <li>Using the reset options within the application</li>
          </ul>
        </div>
      </section>
    </div>
  );
};