/* Vitalis theme fixes. Loaded after xo-webcomponents.min.js. */

/*
 * Background images with separate desktop/mobile versions (slideshow etc.)
 * are picked by CSS: var(--img-mobile) below 768px, var(--img-desktop) above.
 * The theme's lazyloader then writes the full-size URL as an inline style and,
 * on resize, re-reads that inline URL, so the image never switches when the
 * viewport crosses the breakpoint. Clear the inline image on a breakpoint
 * change; the theme's own debounced resize handler then loads the right one.
 */
(() => {
  const breakpoint = window.matchMedia('(min-width: 768px)');

  breakpoint.addEventListener('change', () => {
    document.querySelectorAll('.xo-background-lazyload').forEach((el) => {
      el.style.removeProperty('background-image');
    });
  });
})();

/* Tabs for the "Supplement benefits" section (sections/vitalis-benefits.liquid). */
if (!customElements.get('vitalis-benefits')) {
  customElements.define(
    'vitalis-benefits',
    class extends HTMLElement {
      connectedCallback() {
        this.tabs = Array.from(this.querySelectorAll('[role="tab"]'));
        this.panels = Array.from(this.querySelectorAll('[role="tabpanel"]'));

        this.index = 0;

        this.tabs.forEach((tab, index) => {
          tab.addEventListener('click', () => this.select(index));
          tab.addEventListener('keydown', (event) => this.onKeydown(event, index));
        });

        // Mobile: swipe left/right on a panel to change supplement.
        let startX = null;
        let startY = null;
        this.addEventListener('touchstart', (event) => {
          startX = event.touches[0].clientX;
          startY = event.touches[0].clientY;
        }, { passive: true });
        this.addEventListener('touchend', (event) => {
          if (startX === null) return;
          const dx = event.changedTouches[0].clientX - startX;
          const dy = event.changedTouches[0].clientY - startY;
          startX = null;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) this.step(dx < 0 ? 1 : -1);
        }, { passive: true });

        // Theme editor: show the panel of the block being edited.
        this.onBlockSelect = (event) => {
          const index = this.panels.indexOf(event.target);
          if (index !== -1) this.select(index, false);
        };
        document.addEventListener('shopify:block:select', this.onBlockSelect);
      }

      disconnectedCallback() {
        document.removeEventListener('shopify:block:select', this.onBlockSelect);
      }

      step(direction) {
        const count = this.tabs.length;
        this.select((this.index + direction + count) % count, false);
      }

      select(index, focus = true) {
        this.index = index;
        this.tabs.forEach((tab, i) => {
          const active = i === index;
          tab.setAttribute('aria-selected', String(active));
          tab.tabIndex = active ? 0 : -1;
          this.panels[i].hidden = !active;
        });
        if (focus) this.tabs[index].focus();
      }

      onKeydown(event, index) {
        const last = this.tabs.length - 1;
        const next = {
          ArrowRight: index === last ? 0 : index + 1,
          ArrowLeft: index === 0 ? last : index - 1,
          Home: 0,
          End: last,
        }[event.key];
        if (next === undefined) return;
        event.preventDefault();
        this.select(next);
      }
    }
  );
}
