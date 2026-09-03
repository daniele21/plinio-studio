/**
 * Plinio Admin Dashboard Application Controller
 * Orchestrates auth flow, real-time Firestore synchronization, and UI rendering.
 */

import { adminConfig } from './adminConfig.js';
import { listenAuthState, loginWithGoogle, logout, getCurrentUser } from './authService.js';
import { subscribeLeads, fetchLeads, exportLeadsToCsv } from './leadsService.js';

class AdminApp {
  constructor() {
    this.root = document.querySelector('#admin-root');
    this.state = {
      authStatus: 'loading', // 'loading' | 'unauthenticated' | 'unauthorized' | 'authorized'
      currentUser: null,
      authError: '',
      leads: [],
      filteredLeads: [],
      searchQuery: '',
      statusFilter: 'all',
      expandedLeadId: null,
      isLoadingLeads: true,
      rulesError: false,
    };

    this.unsubscribeLeads = null;
    this.init();
  }

  init() {
    listenAuthState({
      onAuthorized: (user) => {
        this.state.authStatus = 'authorized';
        this.state.currentUser = user;
        this.state.authError = '';
        this.render();
        this.startLeadsSubscription();
      },
      onDenied: (attemptedEmail) => {
        this.stopLeadsSubscription();
        this.state.authStatus = 'unauthorized';
        this.state.currentUser = null;
        this.state.authError = `L’account Google "${escapeHtml(attemptedEmail)}" non è autorizzato ad accedere a questo pannello.`;
        this.render();
      },
      onSignedOut: () => {
        this.stopLeadsSubscription();
        this.state.authStatus = 'unauthenticated';
        this.state.currentUser = null;
        this.state.authError = '';
        this.render();
      },
    });
  }

  startLeadsSubscription() {
    this.stopLeadsSubscription();
    this.state.isLoadingLeads = true;
    this.state.rulesError = false;

    this.unsubscribeLeads = subscribeLeads(
      (leads) => {
        this.state.leads = leads;
        this.state.isLoadingLeads = false;
        this.state.rulesError = false;
        this.applyFilters();
        this.render();
      },
      (error) => {
        this.state.isLoadingLeads = false;
        if (error?.code === 'permission-denied' || error?.message?.includes('Missing or insufficient permissions')) {
          this.state.rulesError = true;
        } else {
          this.state.authError = error?.message || 'Errore durante la lettura da Firestore.';
        }
        this.render();
      }
    );
  }

  stopLeadsSubscription() {
    if (typeof this.unsubscribeLeads === 'function') {
      this.unsubscribeLeads();
      this.unsubscribeLeads = null;
    }
  }

  applyFilters() {
    const query = this.state.searchQuery.trim().toLowerCase();
    const filter = this.state.statusFilter;

    this.state.filteredLeads = this.state.leads.filter((lead) => {
      const matchesSearch =
        !query ||
        lead.fullName.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.company.toLowerCase().includes(query) ||
        lead.role.toLowerCase().includes(query) ||
        (lead.attribution?.utmCampaign && lead.attribution.utmCampaign.toLowerCase().includes(query));

      const matchesStatus = filter === 'all' || lead.status === filter;
      return matchesSearch && matchesStatus;
    });
  }

  handleSearch(query) {
    this.state.searchQuery = query;
    this.applyFilters();
    this.updateTableViewOnly();
  }

  handleStatusFilter(status) {
    this.state.statusFilter = status;
    this.applyFilters();
    this.updateTableViewOnly();
  }

  toggleExpandLead(leadId) {
    this.state.expandedLeadId = this.state.expandedLeadId === leadId ? null : leadId;
    this.updateTableViewOnly();
  }

  async handleLogin() {
    const btn = document.querySelector('#pl-google-login-btn');
    if (btn) btn.disabled = true;

    const res = await loginWithGoogle();
    if (!res.ok) {
      this.state.authError = res.error || 'Accesso non riuscito.';
      this.render();
    }
  }

  async handleLogout() {
    await logout();
  }

  handleExportCsv() {
    exportLeadsToCsv(this.state.filteredLeads.length ? this.state.filteredLeads : this.state.leads);
  }

  render() {
    if (!this.root) return;

    if (this.state.authStatus === 'loading') {
      this.root.innerHTML = `
        <div class="pl-admin-auth-container">
          <div class="pl-admin-spinner"></div>
        </div>
      `;
      return;
    }

    if (this.state.authStatus === 'unauthenticated' || this.state.authStatus === 'unauthorized') {
      this.renderLogin();
      return;
    }

    this.renderDashboard();
  }

  renderLogin() {
    this.root.innerHTML = `
      <div class="pl-admin-auth-container">
        <div class="pl-admin-auth-card">
          <a href="/" class="pl-admin-auth-logo">
            <img src="./brand-kit/brand-icon.png" alt="Plinio Logo">
            <span>Plinio Studio</span>
          </a>

          <div class="pl-admin-auth-badge">Area Riservata</div>
          <h1 class="pl-admin-auth-title">Accesso Amministratore</h1>
          <p class="pl-admin-auth-desc">Accedi con il tuo account Google per consultare i lead ricevuti sul sito.</p>

          <button id="pl-google-login-btn" class="pl-google-btn" type="button">
            <svg viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Accedi con Google</span>
          </button>

          ${
            this.state.authError
              ? `<div class="pl-admin-alert-error" role="alert">${escapeHtml(this.state.authError)}</div>`
              : ''
          }

          <div class="pl-admin-auth-footer-notice">
            L’accesso a questa console è riservato a <code>danielemoltisanti@gmail.com</code>.
          </div>
        </div>
      </div>
    `;

    const loginBtn = this.root.querySelector('#pl-google-login-btn');
    loginBtn?.addEventListener('click', () => this.handleLogin());
  }

  renderDashboard() {
    const user = this.state.currentUser;
    const leads = this.state.leads;
    const today = new Date();
    const leadsToday = leads.filter((l) => {
      if (!l.rawDate) return false;
      return (
        l.rawDate.getDate() === today.getDate() &&
        l.rawDate.getMonth() === today.getMonth() &&
        l.rawDate.getFullYear() === today.getFullYear()
      );
    }).length;

    const latestDate = leads.length && leads[0].dateRelative ? leads[0].dateRelative : 'Nessuno';

    this.root.innerHTML = `
      <div class="pl-admin-shell">
        <header class="pl-admin-header">
          <div class="pl-admin-header__inner">
            <div class="pl-admin-header__brand">
              <img src="./brand-kit/brand-icon.png" alt="Plinio Logo">
              <div class="pl-admin-header__brand-text">
                <span class="pl-admin-header__brand-title">Plinio Studio</span>
                <span class="pl-admin-header__brand-badge">Lead Console</span>
              </div>
            </div>

            <div class="pl-admin-header__user">
              <div class="pl-admin-user-pill">
                ${
                  user?.photoURL
                    ? `<img class="pl-admin-user-avatar" src="${escapeHtml(user.photoURL)}" alt="Avatar">`
                    : `<div class="pl-admin-user-avatar">${(user?.displayName || user?.email || 'A')[0].toUpperCase()}</div>`
                }
                <span>${escapeHtml(user?.email || '')}</span>
              </div>
              <button id="pl-logout-btn" class="pl-admin-btn-logout" type="button">Esci</button>
            </div>
          </div>
        </header>

        <main class="pl-admin-main">
          <!-- KPI Summary -->
          <div class="pl-admin-kpi-grid">
            <div class="pl-admin-kpi-card pl-admin-kpi-card--primary">
              <span class="pl-admin-kpi-label">Lead Totali</span>
              <span class="pl-admin-kpi-value">${leads.length}</span>
              <span class="pl-admin-kpi-note">Raccolti da form pilot</span>
            </div>
            <div class="pl-admin-kpi-card pl-admin-kpi-card--success">
              <span class="pl-admin-kpi-label">Ricevuti Oggi</span>
              <span class="pl-admin-kpi-value">${leadsToday}</span>
              <span class="pl-admin-kpi-note">Ultime 24 ore solari</span>
            </div>
            <div class="pl-admin-kpi-card">
              <span class="pl-admin-kpi-label">Ultimo Contatto</span>
              <span class="pl-admin-kpi-value" style="font-size: 1.35rem; margin-top: 0.25rem;">${escapeHtml(latestDate)}</span>
              <span class="pl-admin-kpi-note">Sincronizzato real-time</span>
            </div>
          </div>

          ${
            this.state.rulesError
              ? `
            <div class="pl-admin-rules-warning" role="alert">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              <div>
                <h4>Regole di sicurezza Firestore da aggiornare</h4>
                <p>La console Firestore ha respinto la lettura diretta perché le <code>firestore.rules</code> non consentono ancora la lettura a questo account.</p>
                <p>Esegui da terminale <code>firebase deploy --only firestore:rules</code> oppure incolla la regola da <code>firestore.rules</code> nella Firebase Console.</p>
              </div>
            </div>
          `
              : ''
          }

          <!-- Controls Bar -->
          <div class="pl-admin-toolbar">
            <div class="pl-admin-toolbar__search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                id="pl-lead-search-input"
                class="pl-admin-input"
                type="search"
                placeholder="Cerca per nome, email, azienda o campagna…"
                value="${escapeHtml(this.state.searchQuery)}"
              />
            </div>

            <div class="pl-admin-toolbar__actions">
              <button id="pl-refresh-btn" class="pl-admin-btn" type="button" title="Aggiorna dati">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
                <span>Ricarica</span>
              </button>

              <button id="pl-export-csv-btn" class="pl-admin-btn pl-admin-btn--primary" type="button" title="Scarica CSV">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                <span>Esporta CSV</span>
              </button>
            </div>
          </div>

          <!-- Table Container -->
          <div id="pl-leads-table-container">
            ${this.renderTableContent()}
          </div>
        </main>
      </div>
    `;

    this.bindDashboardEvents();
  }

  renderTableContent() {
    if (this.state.isLoadingLeads) {
      return `
        <div class="pl-admin-table-wrapper">
          <div class="pl-admin-state-box">
            <div class="pl-admin-spinner"></div>
            <h3>Caricamento lead da Firestore…</h3>
            <p>Connessione al database di Plinio Studio in corso.</p>
          </div>
        </div>
      `;
    }

    const leads = this.state.filteredLeads;

    if (!leads.length) {
      return `
        <div class="pl-admin-table-wrapper">
          <div class="pl-admin-state-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <h3>Nessun lead trovato</h3>
            <p>${
              this.state.searchQuery
                ? 'Nessun contatto corrisponde ai criteri di ricerca inseriti.'
                : 'I contatti compilati dagli utenti sul form del sito appariranno qui in tempo reale.'
            }</p>
          </div>
        </div>
      `;
    }

    return `
      <div class="pl-admin-table-wrapper">
        <table class="pl-admin-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Contatto</th>
              <th>Azienda</th>
              <th>Recapiti</th>
              <th>Campagna / Fonte</th>
              <th style="text-align: right;">Dettagli</th>
            </tr>
          </thead>
          <tbody>
            ${leads.map((lead) => this.renderLeadRow(lead)).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  renderLeadRow(lead) {
    const isExpanded = this.state.expandedLeadId === lead.id;
    const hasUtm = lead.attribution.utmCampaign !== '–' || lead.attribution.utmSource !== '–';

    return `
      <tr data-lead-id="${escapeHtml(lead.id)}">
        <td>
          <span style="font-weight: 500; color: var(--pl-text-dark-primary);">${escapeHtml(lead.dateRelative)}</span>
          <span style="display: block; font-size: 0.725rem; color: var(--pl-text-dark-muted);">${escapeHtml(lead.dateFormatted)}</span>
        </td>
        <td>
          <span class="pl-admin-table__name">${escapeHtml(lead.fullName)}</span>
          <span class="pl-admin-table__role">${escapeHtml(lead.role)}</span>
        </td>
        <td>
          <strong style="color: var(--pl-text-dark-primary);">${escapeHtml(lead.company)}</strong>
        </td>
        <td>
          <a class="pl-admin-table__email" href="mailto:${escapeHtml(lead.email)}">${escapeHtml(lead.email)}</a>
          ${
            lead.phone
              ? `<a class="pl-admin-table__phone" href="tel:${escapeHtml(lead.phone)}">${escapeHtml(lead.phone)}</a>`
              : '<span class="pl-admin-table__phone">–</span>'
          }
        </td>
        <td>
          ${
            hasUtm
              ? `<span class="pl-admin-badge pl-admin-badge--campaign">${escapeHtml(lead.attribution.utmSource)} / ${escapeHtml(lead.attribution.utmCampaign)}</span>`
              : `<span class="pl-admin-badge pl-admin-badge--new">${escapeHtml(lead.source)}</span>`
          }
        </td>
        <td style="text-align: right;">
          <button class="pl-admin-details-btn" data-toggle-lead="${escapeHtml(lead.id)}" type="button" aria-label="Espandi dettagli">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="transform: ${isExpanded ? 'rotate(180deg)' : 'none'}; transition: transform 0.15s ease;">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </td>
      </tr>
      ${
        isExpanded
          ? `
        <tr class="pl-admin-drawer-row">
          <td colspan="6" style="padding: 0;">
            <div class="pl-admin-drawer">
              <div class="pl-admin-drawer__grid">
                <div class="pl-admin-drawer__item">
                  <strong>UTM Source</strong>
                  <span>${escapeHtml(lead.attribution.utmSource)}</span>
                </div>
                <div class="pl-admin-drawer__item">
                  <strong>UTM Medium</strong>
                  <span>${escapeHtml(lead.attribution.utmMedium)}</span>
                </div>
                <div class="pl-admin-drawer__item">
                  <strong>UTM Campaign</strong>
                  <span>${escapeHtml(lead.attribution.utmCampaign)}</span>
                </div>
                <div class="pl-admin-drawer__item">
                  <strong>Referrer</strong>
                  <span>${escapeHtml(lead.attribution.referrer)}</span>
                </div>
                <div class="pl-admin-drawer__item">
                  <strong>Landing Path</strong>
                  <span>${escapeHtml(lead.attribution.landingPath)}</span>
                </div>
                <div class="pl-admin-drawer__item">
                  <strong>Informativa Privacy</strong>
                  <span>v${escapeHtml(lead.privacy.policyVersion)} (${escapeHtml(lead.privacy.acknowledgedAt)})</span>
                </div>
              </div>
            </div>
          </td>
        </tr>
      `
          : ''
      }
    `;
  }

  updateTableViewOnly() {
    const container = document.querySelector('#pl-leads-table-container');
    if (container) {
      container.innerHTML = this.renderTableContent();
      this.bindTableEvents();
    }
  }

  bindDashboardEvents() {
    const logoutBtn = this.root.querySelector('#pl-logout-btn');
    logoutBtn?.addEventListener('click', () => this.handleLogout());

    const searchInput = this.root.querySelector('#pl-lead-search-input');
    searchInput?.addEventListener('input', (e) => this.handleSearch(e.target.value));

    const exportBtn = this.root.querySelector('#pl-export-csv-btn');
    exportBtn?.addEventListener('click', () => this.handleExportCsv());

    const refreshBtn = this.root.querySelector('#pl-refresh-btn');
    refreshBtn?.addEventListener('click', async () => {
      this.state.isLoadingLeads = true;
      this.updateTableViewOnly();
      try {
        this.state.leads = await fetchLeads();
        this.applyFilters();
      } catch (err) {
        console.error(err);
      } finally {
        this.state.isLoadingLeads = false;
        this.updateTableViewOnly();
      }
    });

    this.bindTableEvents();
  }

  bindTableEvents() {
    const buttons = this.root.querySelectorAll('[data-toggle-lead]');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-toggle-lead');
        this.toggleExpandLead(id);
      });
    });
  }
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

document.addEventListener('DOMContentLoaded', () => {
  new AdminApp();
});
