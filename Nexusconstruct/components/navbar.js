class CustomNavbar extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
      <style>
        nav {
          background-color: rgba(30, 41, 59, 0.95);
          backdrop-filter: blur(8px);
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: fixed;
          width: 100%;
          top: 0;
          z-index: 1000;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        .logo {
          color: white;
          font-weight: bold;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .logo-icon {
          width: 1.5rem;
          height: 1.5rem;
        }
        ul {
          display: flex;
          gap: 1.5rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        a {
          color: white;
          text-decoration: none;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          transition: all 0.2s ease;
        }
        a:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        .active {
          background-color: rgb(59, 130, 246);
        }
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
        }
        @media (max-width: 768px) {
          ul {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background-color: rgba(30, 41, 59, 0.95);
            flex-direction: column;
            padding: 1rem 0;
            align-items: center;
            transform: translateY(-150%);
            transition: transform 0.3s ease;
          }
          ul.open {
            transform: translateY(0);
          }
          .mobile-menu-btn {
            display: block;
          }
        }
      </style>
      <nav>
        <a href="/" class="logo">
          <i data-feather="shield" class="logo-icon"></i>
          <span>ConstructGuard Nexus</span>
        </a>
        <div class="flex items-center gap-4">
          <div id="authLinks" class="flex gap-2">
            <a href="/login.html" class="text-white hover:bg-blue-600 px-3 py-1 rounded">Login</a>
            <a href="/signup.html" class="bg-white text-blue-700 hover:bg-gray-100 px-3 py-1 rounded">Sign Up</a>
          </div>
          <div id="userLinks" class="hidden">
            <a href="/admin.html" id="adminLink" class="hidden bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
              Admin Dashboard
            </a>
            <button onclick="logout()" class="text-white hover:bg-blue-600 px-3 py-1 rounded">Logout</button>
          </div>
          <button class="mobile-menu-btn">
            <i data-feather="menu"></i>
          </button>
        </div>
<ul>
          <li><a href="/" class="active">Home</a></li>
          <li><a href="/construction.html">Construction</a></li>
          <li><a href="/security.html">Security</a></li>
          <li><a href="/tracking.html">Track Equipment</a></li>
          <li><a href="/contact.html">Contact</a></li>
        </ul>
      </nav>
      <script>feather.replace();</script>
    `;

        // Mobile menu toggle
        const mobileMenuBtn = this.shadowRoot.querySelector('.mobile-menu-btn');
        const menu = this.shadowRoot.querySelector('ul');

        mobileMenuBtn.addEventListener('click', () => {
            menu.classList.toggle('open');
        });
    }
}
customElements.define('custom-navbar', CustomNavbar);