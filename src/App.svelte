<script>
  import { transformText, countJuzLines } from './lib/khotmil.js';
  import { registerSW } from 'virtual:pwa-register';

  function getInitialTheme() {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (err) {
      // ignore (e.g. storage disabled)
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  let input = $state('');
  let chatInput = $state('');
  let copyStatus = $state('');
  let pasteError = $state('');
  let theme = $state(getInitialTheme());

  let inputEl = $state(null);
  let outputEl = $state(null);
  let syncing = false;

  function syncScroll(from, to) {
    if (syncing || !from || !to) return;
    syncing = true;
    to.scrollTop = from.scrollTop;
    to.scrollLeft = from.scrollLeft;
    requestAnimationFrame(() => {
      syncing = false;
    });
  }

  let juzCount = $derived(countJuzLines(input));

  const GROUPS = [
    { id: 'besuki', name: 'Besuki' },
    { id: 'safinda', name: 'Safinda' },
  ];
  const DEFAULT_PERIODS = { besuki: 14, safinda: 1 };

  function loadSettings() {
    const fallback = { activeGroupId: 'besuki', periods: { ...DEFAULT_PERIODS } };
    try {
      const saved = JSON.parse(localStorage.getItem('khotmil-settings'));
      if (saved && typeof saved === 'object') {
        return {
          activeGroupId: GROUPS.some((g) => g.id === saved.activeGroupId)
            ? saved.activeGroupId
            : fallback.activeGroupId,
          periods: { ...DEFAULT_PERIODS, ...(saved.periods || {}) },
        };
      }
    } catch (err) {
      // ignore (bad JSON or storage disabled)
    }
    return fallback;
  }

  let settings = $state(loadSettings());
  let settingsOpen = $state(false);

  $effect(() => {
    try {
      localStorage.setItem('khotmil-settings', JSON.stringify(settings));
    } catch (err) {
      // ignore (e.g. storage disabled)
    }
  });

  let activePeriodDays = $derived(
    Math.max(1, Number(settings.periods[settings.activeGroupId]) || 1)
  );

  let output = $derived(
    transformText(input, {
      periodDays: activePeriodDays,
      group: settings.activeGroupId,
      chatText: chatInput,
    })
  );

  function selectGroup(id) {
    settings.activeGroupId = id;
  }

  function setPeriod(id, value) {
    const n = parseInt(value, 10);
    settings.periods[id] = Number.isFinite(n) && n > 0 ? n : 1;
  }

  $effect(() => {
    if (!settingsOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') settingsOpen = false;
    };
    const onClick = (e) => {
      if (!e.target.closest('.settings-wrap')) settingsOpen = false;
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  });

  $effect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (err) {
      // ignore (e.g. storage disabled)
    }
  });

  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
  }

  let isFullscreen = $state(false);

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      document.documentElement.requestFullscreen?.();
    }
  }

  $effect(() => {
    const onChange = () => (isFullscreen = !!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  });

  let updateAvailable = $state(false);

  const updateServiceWorker = registerSW({
    onNeedRefresh() {
      updateAvailable = true;
    },
  });

  function applyUpdate() {
    updateAvailable = false;
    updateServiceWorker(true);
  }

  async function handlePaste() {
    pasteError = '';
    try {
      const text = await navigator.clipboard.readText();
      input = text;
    } catch (err) {
      pasteError = 'Gagal menempel dari clipboard. Silakan tempel manual (Ctrl+V) di kotak teks.';
      setTimeout(() => (pasteError = ''), 4000);
    }
  }

  async function handleCopy() {
    copyStatus = '';
    try {
      await navigator.clipboard.writeText(output);
      copyStatus = 'Tersalin!';
    } catch (err) {
      copyStatus = 'Gagal menyalin. Silakan salin manual (Ctrl+C) dari kotak teks.';
    }
    setTimeout(() => (copyStatus = ''), 2000);
  }

  function handleClear() {
    input = '';
  }

  async function handlePasteChat() {
    pasteError = '';
    try {
      chatInput = await navigator.clipboard.readText();
    } catch (err) {
      pasteError = 'Gagal menempel dari clipboard. Silakan tempel manual (Ctrl+V) di kotak teks.';
      setTimeout(() => (pasteError = ''), 4000);
    }
  }

  function handleClearChat() {
    chatInput = '';
  }
</script>

{#if updateAvailable}
  <div class="update-banner">
    <span>🔄 Versi baru tersedia.</span>
    <button type="button" onclick={applyUpdate}>Perbarui</button>
  </div>
{/if}

<main>
  <header>
    <h1>🌸 Khotmil Qur'an 🕋</h1>
    <div class="header-actions">
      <div class="settings-wrap">
        <button
          type="button"
          class="icon-toggle"
          onclick={() => (settingsOpen = !settingsOpen)}
          aria-label="Pengaturan grup"
          aria-expanded={settingsOpen}
          title="Pengaturan grup"
        >
          ⚙️
        </button>
        {#if settingsOpen}
          <div class="settings-popover" role="dialog" aria-label="Pengaturan grup">
            <p class="settings-title">Grup &amp; periode</p>
            {#each GROUPS as g}
              <div class="settings-row">
                <label class="settings-group">
                  <input
                    type="radio"
                    name="active-group"
                    checked={settings.activeGroupId === g.id}
                    onchange={() => selectGroup(g.id)}
                  />
                  <span>{g.name}</span>
                </label>
                <span class="settings-period">
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={settings.periods[g.id]}
                    onchange={(e) => setPeriod(g.id, e.currentTarget.value)}
                    aria-label={`Periode ${g.name} (hari)`}
                  />
                  <span>hari</span>
                </span>
              </div>
            {/each}
            <p class="settings-note">
              Tanggal pada teks digeser maju sesuai periode grup aktif.
            </p>
          </div>
        {/if}
      </div>
      <button
        type="button"
        class="icon-toggle"
        onclick={toggleFullscreen}
        aria-label={isFullscreen ? 'Keluar dari layar penuh' : 'Layar penuh'}
        title={isFullscreen ? 'Keluar dari layar penuh' : 'Layar penuh'}
      >
        {isFullscreen ? '✕' : '⛶'}
      </button>
      <button
        type="button"
        class="icon-toggle"
        onclick={toggleTheme}
        aria-label={theme === 'dark' ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
        title={theme === 'dark' ? 'Mode terang' : 'Mode gelap'}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </div>
  </header>

  <section class="panel">
    <div class="panel-header">
      <label for="input">Teks periode ini</label>
      <div class="actions">
        {#if input}
          <span class="hint">{juzCount} baris juz</span>
        {/if}
        <button type="button" onclick={handlePaste}>📋 Tempel</button>
        <button type="button" class="ghost" onclick={handleClear} disabled={!input}>Bersihkan</button>
      </div>
    </div>
    {#if pasteError}
      <p class="error">{pasteError}</p>
    {/if}
    <textarea
      id="input"
      bind:this={inputEl}
      bind:value={input}
      onscroll={() => syncScroll(inputEl, outputEl)}
      placeholder="Tempel teks pembagian tugas mengaji di sini..."
    ></textarea>
  </section>

  <section class="panel">
    <div class="panel-header">
      <label for="output">Teks periode berikutnya</label>
      <div class="actions">
        {#if copyStatus}
          <span class="hint">{copyStatus}</span>
        {/if}
        <button type="button" onclick={handleCopy} disabled={!output}>📄 Salin</button>
      </div>
    </div>
    <textarea
      id="output"
      bind:this={outputEl}
      value={output}
      onscroll={() => syncScroll(outputEl, inputEl)}
      placeholder="Hasil akan muncul di sini..."
      readonly
    ></textarea>
  </section>

  {#if settings.activeGroupId === 'safinda'}
    <section class="panel chat">
      <div class="panel-header">
        <label for="chat">Setoran via chat</label>
        <div class="actions">
          <button type="button" onclick={handlePasteChat}>📋 Tempel</button>
          <button type="button" class="ghost" onclick={handleClearChat} disabled={!chatInput}>
            Bersihkan
          </button>
        </div>
      </div>
      <textarea
        id="chat"
        bind:value={chatInput}
        placeholder="Tempel pesan setoran dari chat, mis. [8/30, 15:45] Bu Fulan: juz 7-8 kholash"
      ></textarea>
    </section>
  {/if}
</main>

<style>
  :global(:root) {
    --bg: #f4f1ea;
    --panel-bg: #fff;
    --text: #2b2620;
    --muted: #6b6255;
    --border: #e2dccf;
    --accent: #c9a24b;
    --accent-text: #fff;
    --error: #b3413b;
  }

  :global([data-theme='dark']) {
    --bg: #1c1a16;
    --panel-bg: #262319;
    --text: #f5f2ea;
    --muted: #c7bea9;
    --border: #46402f;
    --accent: #e0b45f;
    --accent-text: #1c1a16;
    --error: #f0a99c;
    color-scheme: dark;
  }

  :global([data-theme='light']) {
    color-scheme: light;
  }

  :global(html, body) {
    height: 100%;
  }

  :global(#app) {
    height: 100dvh;
    display: flex;
    flex-direction: column;
  }

  :global(body) {
    margin: 0;
    background: var(--bg);
    color: var(--text);
    font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  }

  main {
    flex: 1;
    min-height: 0;
    width: 100%;
    max-width: 960px;
    margin: 0 auto;
    padding: 0.75rem 1rem 1rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    flex: none;
    /* line content edges up with the textarea inside the panels */
    padding: 0 calc(0.75rem + 1px);
  }

  .header-actions {
    display: flex;
    gap: 0.4rem;
  }

  .icon-toggle {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text);
    width: 2.25rem;
    height: 2.25rem;
    padding: 0;
    border-radius: 50%;
    font-size: 1.1rem;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .settings-wrap {
    position: relative;
    display: flex;
  }

  .settings-popover {
    position: absolute;
    top: calc(100% + 0.4rem);
    right: 0;
    z-index: 10;
    width: 15rem;
    background: var(--panel-bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 0.75rem;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    text-align: left;
  }

  .settings-title {
    margin: 0;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .settings-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .settings-group {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.9rem;
    cursor: pointer;
  }

  .settings-period {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    color: var(--muted);
    font-size: 0.85rem;
  }

  .settings-period input {
    width: 3.25rem;
    padding: 0.3rem 0.4rem;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--panel-bg);
    color: var(--text);
    font-size: 0.85rem;
  }

  .settings-note {
    margin: 0.25rem 0 0;
    color: var(--muted);
    font-size: 0.78rem;
    line-height: 1.4;
  }

  .update-banner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    background: var(--accent);
    color: var(--accent-text);
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
    text-align: center;
  }

  .update-banner button {
    background: var(--accent-text);
    color: var(--accent);
    border-color: var(--accent-text);
    padding: 0.3rem 0.75rem;
  }

  h1 {
    margin: 0;
    font-size: 1.3rem;
  }

  .panel {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    background: var(--panel-bg);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  .panel.chat {
    flex: 0.5 1 0%;
  }

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    flex: none;
  }

  label {
    font-weight: 600;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  button {
    border: 1px solid var(--accent);
    background: var(--accent);
    color: var(--accent-text);
    padding: 0.45rem 0.9rem;
    border-radius: 8px;
    font-size: 0.9rem;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  button.ghost {
    background: transparent;
    color: var(--muted);
    border-color: var(--border);
  }

  textarea {
    flex: 1;
    width: 100%;
    min-height: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI Emoji', ui-monospace, Consolas, monospace;
    font-size: 0.95rem;
    padding: 0.75rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    resize: none;
    line-height: 1.5;
    background: var(--panel-bg);
    color: var(--text);
  }

  textarea::placeholder {
    color: var(--muted);
    opacity: 1;
  }

  .hint {
    margin: 0;
    color: var(--muted);
    font-size: 0.85rem;
  }

  .error {
    margin: 0 0 0.5rem;
    color: var(--error);
    font-size: 0.85rem;
    flex: none;
  }
</style>
