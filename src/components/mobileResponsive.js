/*
 * Small mobile-only UX refinements that cannot be expressed safely in CSS.
 * Desktop is intentionally left untouched.
 */

const MOBILE_QUERY = '(max-width: 768px)';

function renderMobileComparison() {
  const comparison = document.querySelector('#confronto .pl-container');
  if (!comparison) return false;
  if (comparison.querySelector('[data-purpose-mobile]')) return true;

  const mobile = document.createElement('div');
  mobile.className = 'pl-purpose-mobile';
  mobile.setAttribute('data-purpose-mobile', '');
  mobile.innerHTML = `
    <header class="pl-purpose-mobile__head">
      <span class="pl-purpose-mobile__label">Confronto</span>
      <h2 class="pl-purpose-mobile__title">
        <span>Conoscere i progetti non basta.</span>
        <strong>Plinio li trasforma in comunicazione.</strong>
      </h2>
      <p class="pl-purpose-mobile__intro">
        Le AI enterprise possono accedere ai vostri dati. <strong>La differenza è cosa succede dopo.</strong>
      </p>
    </header>

    <div class="pl-purpose-mobile__approaches" aria-label="Confronto tra AI enterprise e Plinio">
      <article class="pl-purpose-mobile-card pl-purpose-mobile-card--ai">
        <div class="pl-purpose-mobile-card__head">
          <span class="pl-purpose-mobile-card__label">AI enterprise</span>
          <h3>Conosce il contesto</h3>
        </div>

        <div class="pl-purpose-mobile-flow" aria-label="File e dati, AI, risposta richiesta">
          <div class="pl-purpose-mobile-flow__item">
            <span class="pl-purpose-mobile-flow__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>
              </svg>
            </span>
            <span>File e dati</span>
          </div>
          <span class="pl-purpose-mobile-flow__arrow" aria-hidden="true">↓</span>
          <div class="pl-purpose-mobile-flow__item">
            <span class="pl-purpose-mobile-flow__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
                <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
                <path d="M12 5v13"/>
              </svg>
            </span>
            <span>AI</span>
          </div>
          <span class="pl-purpose-mobile-flow__arrow" aria-hidden="true">↓</span>
          <div class="pl-purpose-mobile-flow__item">
            <span class="pl-purpose-mobile-flow__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                <line x1="8" y1="9" x2="16" y2="9"/>
                <line x1="8" y1="13" x2="14" y2="13"/>
              </svg>
            </span>
            <span>Risposta richiesta</span>
          </div>
        </div>

        <p class="pl-purpose-mobile-card__foot">Il workflow lo costruite voi.</p>
      </article>

      <div class="pl-purpose-mobile__vs" aria-hidden="true"><span>VS</span></div>

      <article class="pl-purpose-mobile-card pl-purpose-mobile-card--plinio">
        <div class="pl-purpose-mobile-card__head">
          <span class="pl-purpose-mobile-card__label">Plinio</span>
          <h3>È già il workflow per comunicarlo</h3>
        </div>

        <div class="pl-purpose-mobile-flow pl-purpose-mobile-flow--plinio" aria-label="Progetto, cosa raccontare, evidenze e voce, contenuto pronto">
          <div class="pl-purpose-mobile-flow__item">
            <span class="pl-purpose-mobile-flow__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>
              </svg>
            </span>
            <span>Progetto</span>
          </div>
          <span class="pl-purpose-mobile-flow__arrow" aria-hidden="true">↓</span>
          <div class="pl-purpose-mobile-flow__item">
            <span class="pl-purpose-mobile-flow__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="9"/>
                <circle cx="12" cy="12" r="4"/>
                <path d="m16 8 5-5"/><path d="M17 3h4v4"/>
              </svg>
            </span>
            <span>Cosa raccontare</span>
          </div>
          <span class="pl-purpose-mobile-flow__arrow" aria-hidden="true">↓</span>
          <div class="pl-purpose-mobile-flow__item">
            <span class="pl-purpose-mobile-flow__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <path d="m9 15 2 2 4-4"/>
              </svg>
            </span>
            <span>Evidenze + voce</span>
          </div>
          <span class="pl-purpose-mobile-flow__arrow" aria-hidden="true">↓</span>
          <div class="pl-purpose-mobile-flow__item pl-purpose-mobile-flow__item--final">
            <span class="pl-purpose-mobile-flow__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <path d="m9 15 2 2 4-4"/>
              </svg>
            </span>
            <span>Contenuto pronto</span>
          </div>
        </div>

        <p class="pl-purpose-mobile-card__foot"><strong>Voi scegliete e approvate.</strong></p>
      </article>
    </div>

    <section class="pl-purpose-mobile__difference" aria-labelledby="purpose-mobile-difference-title">
      <p class="pl-purpose-mobile__section-label" id="purpose-mobile-difference-title">La differenza, in 3 punti</p>

      <div class="pl-purpose-mobile-diff">
        <h3>Cosa raccontare</h3>
        <div class="pl-purpose-mobile-diff__line">
          <span>AI enterprise</span><span>Da guidare</span>
        </div>
        <div class="pl-purpose-mobile-diff__line pl-purpose-mobile-diff__line--plinio">
          <span>Plinio</span><strong><span aria-hidden="true">✓</span> Nel workflow</strong>
        </div>
      </div>

      <div class="pl-purpose-mobile-diff">
        <h3>Evidenze</h3>
        <div class="pl-purpose-mobile-diff__line">
          <span>AI enterprise</span><span>Da configurare</span>
        </div>
        <div class="pl-purpose-mobile-diff__line pl-purpose-mobile-diff__line--plinio">
          <span>Plinio</span><strong><span aria-hidden="true">✓</span> Collegate</strong>
        </div>
      </div>

      <div class="pl-purpose-mobile-diff">
        <h3>Voce editoriale</h3>
        <div class="pl-purpose-mobile-diff__line">
          <span>AI enterprise</span><span>Configurabile</span>
        </div>
        <div class="pl-purpose-mobile-diff__line pl-purpose-mobile-diff__line--plinio">
          <span>Plinio</span><strong><span aria-hidden="true">✓</span> Nel workflow</strong>
        </div>
      </div>
    </section>

    <p class="pl-purpose-mobile__thesis">
      Con un'AI enterprise potete costruire questo workflow.<br>
      <strong>Plinio è già questo workflow.</strong>
    </p>

    <details class="pl-purpose-mobile__details">
      <summary>
        <span>Vedi il confronto completo</span>
        <span class="pl-purpose-mobile__chevron" aria-hidden="true">⌄</span>
      </summary>
      <div class="pl-purpose-mobile__details-body">
        <div class="pl-purpose-mobile-detail-row">
          <span>File e fonti</span><span>Entrambi</span>
        </div>
        <div class="pl-purpose-mobile-detail-row">
          <span>Cosa raccontare</span><span><em>AI:</em> da guidare<br><strong>Plinio:</strong> nel workflow</span>
        </div>
        <div class="pl-purpose-mobile-detail-row">
          <span>Evidenze</span><span><em>AI:</em> da configurare<br><strong>Plinio:</strong> collegate</span>
        </div>
        <div class="pl-purpose-mobile-detail-row">
          <span>Voce editoriale</span><span><em>AI:</em> configurabile<br><strong>Plinio:</strong> nel workflow</span>
        </div>
        <div class="pl-purpose-mobile-detail-row">
          <span>Obiettivo</span><span><em>AI:</em> assistente aziendale<br><strong>Plinio:</strong> progetti → comunicazione</span>
        </div>
      </div>
    </details>
  `;

  comparison.prepend(mobile);
  return true;
}

function applyMobileResponsiveEnhancements() {
  if (!window.matchMedia(MOBILE_QUERY).matches) return true;

  const faq = document.querySelector('#faq');
  const comparison = document.querySelector('#confronto');
  if (!faq || !comparison) return false;

  if (!renderMobileComparison()) return false;

  /* Mobile starts compact: users choose which objection to open. */
  faq.querySelector('.pl-faq-card[open]')?.removeAttribute('open');

  /* Make swipe the primary mental model; arrows remain as accessible fallback. */
  document.querySelectorAll('.pl-radar-carousel-hint span').forEach((hint) => {
    hint.textContent = 'Scorri per vedere i 3 passaggi →';
  });

  return true;
}

function initMobileResponsiveEnhancements() {
  if (applyMobileResponsiveEnhancements()) return;

  const observer = new MutationObserver(() => {
    if (!applyMobileResponsiveEnhancements()) return;
    observer.disconnect();
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMobileResponsiveEnhancements, { once: true });
} else {
  initMobileResponsiveEnhancements();
}
