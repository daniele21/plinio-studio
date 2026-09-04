/**
 * Plinio "Come funziona" Interactive Pipeline Controller
 * Manages bidirectional cross-highlighting between Radar topics and output cards,
 * auto-cycling idle preview, and keyboard navigation.
 */

const reduceMotion = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false;

export function initHowItWorks() {
  const container = document.querySelector('.pl-v2-how');
  if (!container) return false;

  const topics = [...container.querySelectorAll('[data-how-topic]')];
  const cards = [...container.querySelectorAll('[data-how-card]')];
  const outputMini = container.querySelector('.pl-v2-output-mini');

  if (!topics.length || !cards.length) return false;

  let autoCycleTimer = null;
  let resumeTimer = null;
  let currentIndex = 0;
  let isUserInteracting = false;

  const topicKeys = ['setup', 'method', 'business'];

  /**
   * Sets the active state on the matching topic and card
   * @param {string|null} key - Topic key ('setup' | 'method' | 'business') or null to clear
   */
  const setActiveKey = (key) => {
    if (!key) {
      topics.forEach(t => t.classList.remove('is-active'));
      cards.forEach(c => c.classList.remove('is-active'));
      outputMini?.classList.remove('has-active');
      return;
    }

    topics.forEach(t => {
      const match = t.dataset.howTopic === key;
      t.classList.toggle('is-active', match);
      t.setAttribute('aria-pressed', String(match));
    });

    cards.forEach(c => {
      const match = c.dataset.howCard === key;
      c.classList.toggle('is-active', match);
      c.setAttribute('aria-pressed', String(match));
    });

    outputMini?.classList.add('has-active');
  };

  /**
   * Auto-cycles through topics periodically to demonstrate cause-and-effect
   */
  const startAutoCycle = () => {
    if (reduceMotion || isUserInteracting) return;
    stopAutoCycle();

    autoCycleTimer = setInterval(() => {
      currentIndex = (currentIndex + 1) % topicKeys.length;
      setActiveKey(topicKeys[currentIndex]);
    }, 3600);
  };

  const stopAutoCycle = () => {
    if (autoCycleTimer) {
      clearInterval(autoCycleTimer);
      autoCycleTimer = null;
    }
  };

  const pauseAndScheduleResume = () => {
    isUserInteracting = true;
    stopAutoCycle();
    if (resumeTimer) clearTimeout(resumeTimer);

    resumeTimer = setTimeout(() => {
      isUserInteracting = false;
      setActiveKey(null);
      startAutoCycle();
    }, 4500);
  };

  // Bind Topic Hover & Focus
  topics.forEach((topicEl) => {
    const key = topicEl.dataset.howTopic;

    topicEl.addEventListener('mouseenter', () => {
      pauseAndScheduleResume();
      setActiveKey(key);
    });

    topicEl.addEventListener('mouseleave', () => {
      setActiveKey(null);
    });

    topicEl.addEventListener('focus', () => {
      pauseAndScheduleResume();
      setActiveKey(key);
    });

    topicEl.addEventListener('blur', () => {
      setActiveKey(null);
    });

    // Support keyboard activation
    topicEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        pauseAndScheduleResume();
        setActiveKey(key);
      }
    });
  });

  // Bind Card Hover & Focus
  cards.forEach((cardEl) => {
    const key = cardEl.dataset.howCard;

    cardEl.addEventListener('mouseenter', () => {
      pauseAndScheduleResume();
      setActiveKey(key);
    });

    cardEl.addEventListener('mouseleave', () => {
      setActiveKey(null);
    });

    cardEl.addEventListener('focus', () => {
      pauseAndScheduleResume();
      setActiveKey(key);
    });

    cardEl.addEventListener('blur', () => {
      setActiveKey(null);
    });

    cardEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        pauseAndScheduleResume();
        setActiveKey(key);
      }
    });
  });

  // Pause when mouse enters container, restart on leave
  container.addEventListener('mouseenter', () => {
    stopAutoCycle();
  });

  container.addEventListener('mouseleave', () => {
    if (!isUserInteracting) {
      setActiveKey(null);
      startAutoCycle();
    }
  });

  // Start initial auto-cycle only when visible in viewport
  if (!reduceMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startAutoCycle();
        } else {
          stopAutoCycle();
        }
      });
    }, { threshold: 0.25 });

    observer.observe(container);
  }

  return true;
}
