(() => {
  if (!window.$docsify) {
    throw new Error('Docsify must be loaded before installing this plugin.');
  }

  window.$docsify.plugins.push(hook => {
    hook.mounted(() => {
      function getTheme() {
        return localStorage.getItem('theme') || 'auto';
      }

      function isDark() {
        if (theme === 'auto') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return theme === 'viur_dark';
      }

      function setTheme(newTheme) {
        const noTransitions = Object.assign(document.createElement('style'), {
          textContent: '* { transition: none !important; }'
        });

        theme = newTheme;
        localStorage.setItem('theme', theme);

        // Update the UI
        [...menu.querySelectorAll('sl-menu-item')].map(item => (item.checked = item.getAttribute('value') === theme));
        menuIcon.name = isDark() ? 'moon' : 'sun';

        // Toggle the dark mode class without transitions
        document.body.appendChild(noTransitions);
        requestAnimationFrame(() => {
          if (theme === 'viur') {
            document.documentElement.classList.remove('sl-theme-viur_dark');
            document.documentElement.classList.add('sl-theme-viur');
          } else {
            document.documentElement.classList.remove('sl-theme-viur');
            document.documentElement.classList.toggle('sl-theme-viur_dark', isDark());
          }

          requestAnimationFrame(() => document.body.removeChild(noTransitions));
        });
      }

      let theme = getTheme();

      // Generate the theme picker dropdown
      const dropdown = document.createElement('sl-dropdown');
      dropdown.classList.add('theme-picker');
      dropdown.innerHTML = `
        <sl-button size="small" pill slot="trigger" caret>
          <sl-icon library="bootstrap" name="sun" label="Select Theme"></sl-icon>
        </sl-button>
        <sl-menu>
          <sl-menu-label>Toggle <kbd>\\</kbd></sl-menu-label>
          <sl-menu-item type="checkbox" value="viur">Light</sl-menu-item>
          <sl-menu-item type="checkbox" value="viur_dark">Dark</sl-menu-item>
          <sl-divider></sl-divider>
          <sl-menu-item type="checkbox" value="auto">Auto</sl-menu-item>
        </sl-menu>
      `;
      document.querySelector('.sidebar-toggle').insertAdjacentElement('afterend', dropdown);

      // Listen for selections
      const menu = dropdown.querySelector('sl-menu');
      const menuIcon = dropdown.querySelector('sl-icon');
      menu.addEventListener('sl-select', event => setTheme(event.detail.item.value));

      // Update the theme when the preference changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => setTheme(theme));

      // Toggle themes when pressing backslash
      document.addEventListener('keydown', event => {
        if (event.key === '\\' && !event.composedPath().some(el => ['input', 'textarea'].includes(el?.tagName?.toLowerCase()))) {
          event.preventDefault();

          setTheme(isDark() ? 'viur' : 'viur_dark');
          show();
        }
      });

      // Set the initial theme and sync the UI
      setTheme(theme);
    });
  });
})();
