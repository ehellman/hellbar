// tiling-direction.ts
import * as zebar from 'zebar';

// Types
type WmProvider = 'glazewm' | 'komorebi';
type WmOutputMap = {
  glazewm: zebar.ProviderMap['glazewm']['output'];
  komorebi: zebar.ProviderMap['komorebi']['output'];
};
type WmOutput<T extends WmProvider> = WmOutputMap[T];

// Create provider once
const providers = zebar.createProviderGroup({ 
  glazewm: { type: 'glazewm' }, 
  komorebi: { type: 'komorebi' } 
});

class TilingDirectionWidget extends HTMLElement {
  private shadow: ShadowRoot;
  private activeTimer: number | null = null;
  private provider: typeof providers.outputMap.glazewm;
  // private unsubscribe: (() => void) | null = null;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.provider = providers.outputMap.glazewm;

    // Initialize HTML structure
    this.shadow.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }

        .tiling-direction_button {
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          padding: 4px 8px;
          font-family: inherit;
          font-size: inherit;
          outline: none;
        }

        .workspace-button_name {
          opacity: 0.7;
          transition: opacity 0.3s ease;
        }

        .workspace-button_name.active {
          opacity: 1;
        }

        /* Optional: Add hover effect */
        .tiling-direction_button:hover .workspace-button_name {
          opacity: 1;
        }
      </style>
      <button class="tiling-direction_button">
        <span class="workspace-button_name">󰿢</span>
      </button>
    `;

    // Bind methods
    this.handleClick = this.handleClick.bind(this);
    this.updateDisplay = this.updateDisplay.bind(this);
  }

  static get observedAttributes() {
    return ['provider'];
  }

  connectedCallback() {
    // Add click handler
    const button = this.shadow.querySelector('.tiling-direction_button');
    if (button) {
      button.addEventListener('click', this.handleClick);
    }

    // Subscribe to provider updates
      // this.unsubscribe = 
    providers.onOutput((
      // outputMap
    ) => {
      // const provider = this.getAttribute('provider') as WmProvider || 'glazewm';
      this.updateDisplay(
        // outputMap[provider]
      );
    });
    
  }

  disconnectedCallback() {
    // Clean up
    const button = this.shadow.querySelector('.tiling-direction_button');
    if (button) {
      button.removeEventListener('click', this.handleClick);
    }

    // if (this.unsubscribe) {
    //   this.unsubscribe();
    // }

    if (this.activeTimer) {
      window.clearTimeout(this.activeTimer);
    }
  }

  private handleClick() {
    const provider = this.getAttribute('provider') as WmProvider || 'glazewm';

    if (provider === 'glazewm') {
      providers.outputMap[provider]?.runCommand('toggle-tiling-direction');
    }
    
  }

  private updateDisplay(
    // output: WmOutput<WmProvider>
  ) {
    const button = this.shadow.querySelector('.tiling-direction_button');
    const span = this.shadow.querySelector('.workspace-button_name');
    
    if (button && span) {
      // button.setAttribute('data-direction', output?.tilingDirection || 'horizontal');
      span.classList.add('active');

      // Reset existing timer if any
      if (this.activeTimer) {
        window.clearTimeout(this.activeTimer);
      }

      // Set new timer
      this.activeTimer = window.setTimeout(() => {
        span.classList.remove('active');
        this.activeTimer = null;
      }, 2000);
    }
  }
}

// Register the component
customElements.define('tiling-direction-widget', TilingDirectionWidget);