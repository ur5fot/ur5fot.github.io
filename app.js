const STORAGE_KEY = 'timerec-state';
const VUE = window.Vue;

const defaultActivities = () => [
  { id: 'sleep', name: 'Сон', color: '#0ea5e9', durationMs: 0 },
  { id: 'work', name: 'Работа', color: '#2563eb', durationMs: 0 },
  { id: 'life', name: 'Личное', color: '#f97316', durationMs: 0 }
];

const ACTIVITY_COLORS = ['#2563eb', '#dc2626', '#0ea5e9', '#10b981', '#a855f7', '#f97316'];
const pickRandomColor = () => ACTIVITY_COLORS[Math.floor(Math.random() * ACTIVITY_COLORS.length)];

const isoNow = () => new Date().toISOString();

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const activities = defaultActivities();
      return {
        activities,
        activeId: activities[0]?.id ?? null,
        activeStart: activities.length ? Date.now() : null,
        lastReset: isoNow()
      };
    }
    const parsed = JSON.parse(raw);
    parsed.activities = (parsed.activities || []).map((item) => ({
      id: item.id,
      name: item.name,
      color: item.color || '#2563eb',
      durationMs: Number(item.durationMs) || 0
    }));
    return {
      activities: parsed.activities,
      activeId: parsed.activeId || parsed.activities[0]?.id || null,
      activeStart: parsed.activeStart || Date.now(),
      lastReset: parsed.lastReset || isoNow()
    };
  } catch (err) {
    console.warn('Не удалось загрузить состояние, используется новое', err);
    const activities = defaultActivities();
    return {
      activities,
      activeId: activities[0]?.id ?? null,
      activeStart: Date.now(),
      lastReset: isoNow()
    };
  }
};

VUE.createApp({
  data() {
    const state = loadState();
    return {
      activities: state.activities,
      activeId: state.activeId,
      activeStart: state.activeStart,
      lastReset: state.lastReset,
      newActivityName: '',
      newActivityColor: pickRandomColor(),
      isColorManuallyPicked: false,
      editingId: null,
      editingName: '',
      now: Date.now()
    };
  },
  computed: {
    totalDuration() {
      return this.activities.reduce((sum, activity) => sum + this.getActivityDuration(activity), 0);
    },
    resetLabel() {
      try {
        return new Date(this.lastReset).toLocaleString('ru-RU', {
          day: '2-digit',
          month: 'long',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (err) {
        return '—';
      }
    }
  },
  methods: {
    persist() {
      const payload = {
        activities: this.activities.map((activity) => ({ ...activity })),
        activeId: this.activeId,
        activeStart: this.activeStart,
        lastReset: this.lastReset
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    },
    randomColor() {
      return pickRandomColor();
    },
    createActivity() {
      const name = this.newActivityName.trim();
      if (!name) return;
      const color =
        this.isColorManuallyPicked && this.newActivityColor ? this.newActivityColor : this.randomColor();
      const activity = {
        id: `act-${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 6)}`,
        name,
        color,
        durationMs: 0
      };
      this.activities.push(activity);
      if (!this.activeId) {
        this.activeId = activity.id;
        this.activeStart = Date.now();
      }
      this.newActivityName = '';
      this.newActivityColor = this.randomColor();
      this.isColorManuallyPicked = false;
      this.persist();
    },
    getActivityDuration(activity) {
      let total = activity.durationMs || 0;
      if (activity.id === this.activeId && this.activeStart) {
        total += Math.max(0, this.now - this.activeStart);
      }
      return total;
    },
    formatDuration(ms) {
      if (!ms || ms < 1000) {
        return '00:00:00';
      }
      const totalSeconds = Math.floor(ms / 1000);
      const seconds = totalSeconds % 60;
      const minutes = Math.floor(totalSeconds / 60) % 60;
      const hours = Math.floor(totalSeconds / 3600);
      const pad = (value) => String(value).padStart(2, '0');
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    },
    addElapsedToActive() {
      if (!this.activeId || !this.activeStart) return;
      const now = Date.now();
      const activity = this.activities.find((item) => item.id === this.activeId);
      if (activity) {
        activity.durationMs += Math.max(0, now - this.activeStart);
      }
      this.activeStart = now;
    },
    selectActivity(activity) {
      if (activity.id === this.activeId) return;
      this.addElapsedToActive();
      this.activeId = activity.id;
      this.activeStart = Date.now();
      this.persist();
    },
    startEditing(activity) {
      this.editingId = activity.id;
      this.editingName = activity.name;
      this.$nextTick(() => {
        const input = this.$el.querySelector(`input[data-edit-id="${activity.id}"]`);
        if (input) {
          input.focus();
          input.select();
        }
      });
    },
    applyEdit(activity) {
      if (this.editingId !== activity.id) return;
      const updated = this.editingName.trim();
      if (updated) {
        activity.name = updated;
        this.persist();
      }
      this.editingId = null;
      this.editingName = '';
    },
    moveActivity(from, to) {
      if (to < 0 || to >= this.activities.length) return;
      const [item] = this.activities.splice(from, 1);
      this.activities.splice(to, 0, item);
      if (!this.activeId) {
        this.activeId = this.activities[0]?.id || null;
        this.activeStart = this.activeId ? Date.now() : null;
      }
      this.persist();
    },
    removeActivity(id) {
      if (this.activities.length <= 1) {
        alert('Нужна хотя бы одна активность.');
        return;
      }
      if (this.activeId === id) {
        this.addElapsedToActive();
      }
      this.activities = this.activities.filter((activity) => activity.id !== id);
      if (!this.activities.find((activity) => activity.id === this.activeId)) {
        this.activeId = this.activities[0]?.id || null;
        this.activeStart = this.activeId ? Date.now() : null;
      }
      this.persist();
    },
    handleBeforeUnload() {
      this.addElapsedToActive();
      this.persist();
    },
    resetTimers() {
      if (!confirm('Сбросить накопленное время по всем видам деятельности?')) {
        return;
      }
      this.addElapsedToActive();
      this.activities.forEach((activity) => {
        activity.durationMs = 0;
      });
      this.activeStart = Date.now();
      this.lastReset = isoNow();
      this.persist();
    }
  },
  mounted() {
    this.intervalId = setInterval(() => {
      this.now = Date.now();
    }, 1000);
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  },
  unmounted() {
    clearInterval(this.intervalId);
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  }
}).mount('#app');
