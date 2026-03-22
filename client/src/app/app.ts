import { Component, OnInit, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [DatePipe],
  template: `
    <!-- Animated background orbs -->
    <div class="bg-orbs">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
      <div class="orb orb-4"></div>
    </div>

    <div class="container">
      <div class="card">
        <!-- Status bar -->
        <div class="status-bar">
          <div class="status-indicator" [class.connected]="connected()" [class.error]="!!error()">
            <span class="status-dot"></span>
            <span class="status-text">{{ statusText() }}</span>
          </div>
          @if (requestCount() > 0) {
            <span class="request-count" title="API requests made">
              {{ requestCount() }} {{ requestCount() === 1 ? 'request' : 'requests' }}
            </span>
          }
        </div>

        <!-- Logo area -->
        <div class="logo">
          <div class="logo-icon angular-icon">
            <svg width="64" height="64" viewBox="0 0 256 256" fill="none">
              <polygon points="128,16 240,224 16,224" fill="url(#grad)" />
              <polygon points="128,64 192,200 64,200" fill="#1a1a2e" />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#dd0031;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#c3002f;stop-opacity:1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div class="connector">
            <div class="connector-line"></div>
            <div class="connector-pulse"></div>
            <div class="connector-line"></div>
          </div>
          <div class="logo-icon dotnet-icon">
            <svg width="64" height="64" viewBox="0 0 256 256" fill="none">
              <circle cx="128" cy="128" r="112" fill="url(#dotnet-grad)" />
              <text x="128" y="148" text-anchor="middle" font-size="72" font-weight="bold" fill="white" font-family="Arial, sans-serif">.N</text>
              <defs>
                <linearGradient id="dotnet-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#512bd4;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#7b3ff2;stop-opacity:1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <h1>Angular <span class="highlight">+</span> .NET <span class="highlight">+</span> Azure AKS</h1>
        <p class="subtitle">Full-Stack Hello World!</p>

        <!-- Message box -->
        <div class="message-box" [class.loaded]="connected()" [class.has-error]="!!error()">
          @if (loading()) {
            <div class="loading-container">
              <div class="pulse-loader">
                <span></span><span></span><span></span>
              </div>
              <p class="loading-text">Connecting to API...</p>
            </div>
          } @else if (error()) {
            <div class="error">
              <div class="error-icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <p class="error-msg">{{ error() }}</p>
              <button class="retry-btn" (click)="fetchMessage()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="23 4 23 10 17 10"/>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
                Retry
              </button>
            </div>
          } @else {
            <div class="success-response">
              <div class="response-header">
                <span class="method-badge">GET</span>
                <span class="endpoint">/api/hello</span>
              </div>
              <p class="api-response">{{ message() }}</p>
              <div class="response-meta">
                <span class="meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {{ responseTime() }}ms
                </span>
                <span class="meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  {{ lastFetched() | date:'mediumTime' }}
                </span>
              </div>
              <button class="refresh-btn" [class.spinning]="refreshing()" (click)="fetchMessage()" [disabled]="refreshing()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="23 4 23 10 17 10"/>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
                {{ refreshing() ? 'Refreshing...' : 'Refresh' }}
              </button>
            </div>
          }
        </div>

        <!-- Tech stack badges -->
        <div class="tech-stack">
          <span class="badge angular" style="--delay: 0">Angular</span>
          <span class="badge dotnet" style="--delay: 1">.NET 10</span>
          <span class="badge typescript" style="--delay: 2">TypeScript</span>
          <span class="badge csharp" style="--delay: 3">C#</span>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>Built with ❤️ using modern web technologies</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: #0a0a1a;
      font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
      overflow: hidden;
      position: relative;
    }

    /* ---------- Animated background orbs ---------- */
    .bg-orbs {
      position: fixed;
      inset: 0;
      z-index: 0;
      overflow: hidden;
      pointer-events: none;
    }

    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.35;
      animation: drift 20s ease-in-out infinite;
    }

    .orb-1 {
      width: 400px; height: 400px;
      background: radial-gradient(circle, #dd0031, transparent 70%);
      top: -10%; left: -5%;
      animation-duration: 18s;
    }

    .orb-2 {
      width: 350px; height: 350px;
      background: radial-gradient(circle, #512bd4, transparent 70%);
      bottom: -10%; right: -5%;
      animation-duration: 22s;
      animation-delay: -5s;
    }

    .orb-3 {
      width: 250px; height: 250px;
      background: radial-gradient(circle, #3178c6, transparent 70%);
      top: 50%; left: 60%;
      animation-duration: 25s;
      animation-delay: -10s;
    }

    .orb-4 {
      width: 200px; height: 200px;
      background: radial-gradient(circle, #68217a, transparent 70%);
      top: 30%; left: 20%;
      animation-duration: 20s;
      animation-delay: -15s;
    }

    @keyframes drift {
      0%, 100% { transform: translate(0, 0) scale(1); }
      25% { transform: translate(60px, -40px) scale(1.1); }
      50% { transform: translate(-30px, 60px) scale(0.95); }
      75% { transform: translate(40px, 20px) scale(1.05); }
    }

    /* ---------- Layout ---------- */
    .container {
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 2rem;
    }

    .card {
      background: rgba(255, 255, 255, 0.04);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 28px;
      padding: 2.5rem;
      text-align: center;
      max-width: 520px;
      width: 100%;
      box-shadow:
        0 25px 60px rgba(0, 0, 0, 0.5),
        inset 0 1px 0 rgba(255, 255, 255, 0.06);
      animation: cardEnter 0.8s cubic-bezier(0.16, 1, 0.3, 1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .card:hover {
      transform: translateY(-4px);
      box-shadow:
        0 30px 70px rgba(0, 0, 0, 0.6),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
    }

    @keyframes cardEnter {
      from { opacity: 0; transform: translateY(30px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* ---------- Status bar ---------- */
    .status-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.75rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #666;
      transition: background 0.3s ease;
      position: relative;
    }

    .status-indicator.connected .status-dot {
      background: #34d399;
      box-shadow: 0 0 8px rgba(52, 211, 153, 0.6);
      animation: pulse-dot 2s ease-in-out infinite;
    }

    .status-indicator.error .status-dot {
      background: #ff6b6b;
      box-shadow: 0 0 8px rgba(255, 107, 107, 0.6);
    }

    @keyframes pulse-dot {
      0%, 100% { box-shadow: 0 0 4px rgba(52, 211, 153, 0.4); }
      50% { box-shadow: 0 0 12px rgba(52, 211, 153, 0.8); }
    }

    .status-text {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.5);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .request-count {
      font-size: 0.7rem;
      color: rgba(255, 255, 255, 0.3);
      font-weight: 400;
      background: rgba(255, 255, 255, 0.05);
      padding: 0.2rem 0.6rem;
      border-radius: 10px;
    }

    /* ---------- Logo ---------- */
    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.25rem;
      margin-bottom: 1.75rem;
    }

    .logo-icon {
      position: relative;
      transition: transform 0.3s ease;
    }

    .logo-icon:hover {
      transform: scale(1.1) rotate(-3deg);
    }

    .logo-icon svg {
      filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.4));
      animation: float 4s ease-in-out infinite;
    }

    .dotnet-icon svg {
      animation-delay: 1s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .connector {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .connector-line {
      width: 16px;
      height: 2px;
      background: linear-gradient(90deg, rgba(221, 0, 49, 0.5), rgba(81, 43, 212, 0.5));
      border-radius: 1px;
    }

    .connector-pulse {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: linear-gradient(135deg, #dd0031, #512bd4);
      animation: connectorPulse 2s ease-in-out infinite;
    }

    @keyframes connectorPulse {
      0%, 100% { transform: scale(1); opacity: 0.6; }
      50% { transform: scale(1.4); opacity: 1; }
    }

    /* ---------- Typography ---------- */
    h1 {
      font-size: 2.5rem;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 0.4rem;
      letter-spacing: -0.03em;
    }

    .highlight {
      background: linear-gradient(135deg, #dd0031, #512bd4);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      font-size: 1.05rem;
      color: rgba(255, 255, 255, 0.4);
      margin: 0 0 2rem;
      font-weight: 400;
      letter-spacing: 0.02em;
    }

    /* ---------- Message box ---------- */
    .message-box {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 1.75rem;
      margin-bottom: 1.75rem;
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .message-box.loaded {
      border-color: rgba(52, 211, 153, 0.25);
      background: rgba(52, 211, 153, 0.03);
    }

    .message-box.has-error {
      border-color: rgba(255, 107, 107, 0.25);
      background: rgba(255, 107, 107, 0.03);
    }

    /* Loading */
    .loading-container {
      padding: 1rem 0;
    }

    .pulse-loader {
      display: flex;
      justify-content: center;
      gap: 6px;
      margin-bottom: 1rem;
    }

    .pulse-loader span {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: linear-gradient(135deg, #dd0031, #512bd4);
      animation: bounce 1.4s ease-in-out infinite;
    }

    .pulse-loader span:nth-child(2) { animation-delay: 0.16s; }
    .pulse-loader span:nth-child(3) { animation-delay: 0.32s; }

    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
      40% { transform: scale(1); opacity: 1; }
    }

    .loading-text {
      color: rgba(255, 255, 255, 0.45);
      font-size: 0.85rem;
      margin: 0;
      letter-spacing: 0.02em;
    }

    /* Success response */
    .success-response {
      animation: revealResponse 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes revealResponse {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .response-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .method-badge {
      font-size: 0.65rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      background: rgba(52, 211, 153, 0.15);
      color: #34d399;
      letter-spacing: 0.05em;
      font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
    }

    .endpoint {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.5);
      font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
    }

    .api-response {
      font-size: 1.6rem;
      font-weight: 700;
      background: linear-gradient(135deg, #a78bfa, #60a5fa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 1rem;
      line-height: 1.3;
    }

    .response-meta {
      display: flex;
      justify-content: center;
      gap: 1.25rem;
      margin-bottom: 1.25rem;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.35);
    }

    .meta-item svg {
      opacity: 0.5;
    }

    .refresh-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.55rem 1.25rem;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.8rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.25s ease;
      font-family: inherit;
    }

    .refresh-btn:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
      color: #fff;
      transform: translateY(-1px);
    }

    .refresh-btn:active:not(:disabled) {
      transform: translateY(0);
    }

    .refresh-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .refresh-btn.spinning svg {
      animation: spinOnce 0.6s ease-in-out;
    }

    @keyframes spinOnce {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Error */
    .error {
      padding: 0.5rem 0;
    }

    .error-icon-wrapper {
      margin-bottom: 0.75rem;
      animation: shake 0.5s ease-in-out;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-4px); }
      40% { transform: translateX(4px); }
      60% { transform: translateX(-3px); }
      80% { transform: translateX(3px); }
    }

    .error-msg {
      color: rgba(255, 107, 107, 0.8);
      margin: 0 0 1rem;
      font-size: 0.85rem;
      line-height: 1.5;
    }

    .retry-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.55rem 1.25rem;
      border-radius: 10px;
      border: 1px solid rgba(255, 107, 107, 0.3);
      background: rgba(255, 107, 107, 0.1);
      color: #ff8a8a;
      font-size: 0.8rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.25s ease;
      font-family: inherit;
    }

    .retry-btn:hover {
      background: rgba(255, 107, 107, 0.2);
      border-color: rgba(255, 107, 107, 0.5);
      transform: translateY(-1px);
    }

    /* ---------- Tech stack ---------- */
    .tech-stack {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 1.5rem;
    }

    .badge {
      font-size: 0.7rem;
      font-weight: 600;
      padding: 0.35rem 0.75rem;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      cursor: default;
      transition: all 0.25s ease;
      animation: badgeEnter 0.5s cubic-bezier(0.16, 1, 0.3, 1) backwards;
      animation-delay: calc(var(--delay) * 0.1s + 0.5s);
    }

    @keyframes badgeEnter {
      from { opacity: 0; transform: translateY(8px) scale(0.9); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .badge:hover {
      transform: translateY(-2px) scale(1.05);
    }

    .badge.angular {
      background: rgba(221, 0, 49, 0.12);
      color: #ff4c6a;
      border: 1px solid rgba(221, 0, 49, 0.25);
    }
    .badge.angular:hover {
      box-shadow: 0 4px 16px rgba(221, 0, 49, 0.2);
    }

    .badge.dotnet {
      background: rgba(81, 43, 212, 0.12);
      color: #a78bfa;
      border: 1px solid rgba(81, 43, 212, 0.25);
    }
    .badge.dotnet:hover {
      box-shadow: 0 4px 16px rgba(81, 43, 212, 0.2);
    }

    .badge.typescript {
      background: rgba(49, 120, 198, 0.12);
      color: #60a5fa;
      border: 1px solid rgba(49, 120, 198, 0.25);
    }
    .badge.typescript:hover {
      box-shadow: 0 4px 16px rgba(49, 120, 198, 0.2);
    }

    .badge.csharp {
      background: rgba(104, 33, 122, 0.12);
      color: #c084fc;
      border: 1px solid rgba(104, 33, 122, 0.25);
    }
    .badge.csharp:hover {
      box-shadow: 0 4px 16px rgba(104, 33, 122, 0.2);
    }

    /* ---------- Footer ---------- */
    .footer {
      padding-top: 0.5rem;
    }

    .footer p {
      font-size: 0.7rem;
      color: rgba(255, 255, 255, 0.2);
      margin: 0;
      letter-spacing: 0.02em;
    }

    /* ---------- Responsive ---------- */
    @media (max-width: 480px) {
      .card {
        padding: 1.75rem;
        border-radius: 20px;
      }
      h1 { font-size: 1.75rem; }
      .api-response { font-size: 1.25rem; }
      .response-meta { flex-direction: column; gap: 0.5rem; }
      .logo-icon svg { width: 48px; height: 48px; }
    }
  `],
})
export class App implements OnInit {
  protected readonly message = signal('');
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly connected = signal(false);
  protected readonly responseTime = signal(0);
  protected readonly lastFetched = signal<Date | null>(null);
  protected readonly requestCount = signal(0);
  protected readonly refreshing = signal(false);

  protected readonly statusText = computed(() => {
    if (this.loading() && !this.refreshing()) return 'Connecting...';
    if (this.error()) return 'Disconnected';
    if (this.connected()) return 'Connected';
    return 'Unknown';
  });

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchMessage();
  }

  fetchMessage(): void {
    const isRefresh = this.connected();
    if (isRefresh) {
      this.refreshing.set(true);
    } else {
      this.loading.set(true);
    }
    this.error.set('');

    const startTime = performance.now();
    this.requestCount.update(c => c + 1);

    this.http.get<{ message: string }>('/api/hello').subscribe({
      next: (response) => {
        const elapsed = Math.round(performance.now() - startTime);
        this.message.set(response.message);
        this.responseTime.set(elapsed);
        this.lastFetched.set(new Date());
        this.connected.set(true);
        this.loading.set(false);
        this.refreshing.set(false);
      },
      error: () => {
        this.error.set('Could not connect to the .NET API. Make sure the backend is running on port 5000.');
        this.connected.set(false);
        this.loading.set(false);
        this.refreshing.set(false);
      },
    });
  }
}
