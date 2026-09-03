/**
 * Plinio Admin Dashboard Configuration
 * Centralized settings for admin authentication, allowed users, and data display.
 */

export const adminConfig = {
  // Authorized email addresses allowed to access the admin portal
  allowedEmails: [
    'danielemoltisanti@gmail.com',
  ],

  // Firestore database ID and collection storing pilot lead submissions
  databaseId: 'lead',
  collectionName: 'lead',

  // Query and polling settings
  query: {
    defaultSortField: 'createdAt',
    defaultSortDirection: 'desc',
    maxResults: 150,
  },

  // Status badges dictionary
  statusLabels: {
    new: { label: 'Nuovo', color: 'var(--pl-verification-sage)', bg: 'rgba(103, 154, 146, 0.16)' },
    contacted: { label: 'Contattato', color: 'var(--pl-bright-accent)', bg: 'rgba(255, 117, 71, 0.16)' },
    qualified: { label: 'Qualificato', color: 'var(--pl-terracotta)', bg: 'rgba(214, 85, 39, 0.16)' },
    archived: { label: 'Archiviato', color: 'var(--pl-muted-sand)', bg: 'rgba(156, 138, 120, 0.16)' },
  },

  // Interface strings and labels
  strings: {
    appName: 'Plinio Studio',
    panelTitle: 'Pannello Lead Riservato',
    accessDeniedTitle: 'Accesso non autorizzato',
    accessDeniedMessage: 'Questo account Google non dispone dei permessi di amministratore per accedere al pannello.',
    loginPrompt: 'Accedi con l’account Google autorizzato per visualizzare i lead ricevuti.',
  },
};
