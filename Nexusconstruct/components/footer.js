class CustomFooter extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
      <style>
        footer {
          background-color: #1e293b;
          color: white;
          padding: 3rem 2rem;
        }
        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.25rem;
          font-weight: bold;
          margin-bottom: 1rem;
        }
        .footer-logo-icon {
          width: 1.5rem;
          height: 1.5rem;
        }
        .footer-heading {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #f8fafc;
        }
        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .footer-link {
          color: #cbd5e1;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-link:hover {
          color: #ffffff;
        }
        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .contact-icon {
          width: 1rem;
          height: 1rem;
        }
        .social-links {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }
        .social-link {
          color: white;
          transition: transform 0.2s;
        }
        .social-link:hover {
          transform: translateY(-2px);
        }
        .copyright {
          margin-top: 3rem;
          text-align: center;
          padding-top: 1.5rem;
          border-top: 1px solid #334155;
          color: #94a3b8;
          font-size: 0.875rem;
        }
      </style>
      <footer>
        <div class="footer-container">
          <div>
            <div class="footer-logo">
              <i data-feather="shield" class="footer-logo-icon"></i>
              <span>ConstructGuard Nexus</span>
            </div>
            <p class="text-gray-300 mt-2">Your trusted partner in construction and security solutions throughout Kenya.</p>
          </div>
          <div>
            <h3 class="footer-heading">Quick Links</h3>
            <div class="footer-links">
              <a href="/construction.html" class="footer-link">Equipment Hire</a>
              <a href="/construction.html#contractors" class="footer-link">Contractor Marketplace</a>
              <a href="/security.html" class="footer-link">Security Systems</a>
              <a href="/tracking.html" class="footer-link">Track Equipment</a>
            </div>
          </div>
          <div>
            <h3 class="footer-heading">Company</h3>
            <div class="footer-links">
              <a href="/about.html" class="footer-link">About Us</a>
              <a href="/contact.html" class="footer-link">Contact Us</a>
              <a href="#" class="footer-link">Careers</a>
              <a href="#" class="footer-link">Blog</a>
            </div>
          </div>
          <div>
            <h3 class="footer-heading">Contact Us</h3>
            <div class="contact-info">
              <div class="contact-item">
                <i data-feather="map-pin" class="contact-icon"></i>
                <span>Nairobi, Kenya</span>
              </div>
              <div class="contact-item">
                <i data-feather="phone" class="contact-icon"></i>
                <a href="tel:+254756167594" class="footer-link">+254 756 167 594</a>
              </div>
              <div class="contact-item">
                <i data-feather="mail" class="contact-icon"></i>
                <a href="mailto:info@nexusconstruct.com" class="footer-link">info@nexusconstruct.com</a>
              </div>
            </div>
            <div class="social-links">
              <a href="#" class="social-link"><i data-feather="facebook"></i></a>
              <a href="#" class="social-link"><i data-feather="twitter"></i></a>
              <a href="#" class="social-link"><i data-feather="linkedin"></i></a>
              <a href="#" class="social-link"><i data-feather="instagram"></i></a>
            </div>
          </div>
        </div>
        <div class="copyright">
          &copy; 2025 ConstructGuard Nexus. All rights reserved.
        </div>
      </footer>
      <script>feather.replace();</script>
    `;
    }
}
customElements.define('custom-footer', CustomFooter);