<script>
  import { transformText, countJuzLines } from './lib/khotmil.js';

  let input = $state('');
  let copyStatus = $state('');
  let pasteError = $state('');

  let output = $derived(transformText(input));
  let juzCount = $derived(countJuzLines(input));

  async function handlePaste() {
    pasteError = '';
    try {
      const text = await navigator.clipboard.readText();
      input = text;
    } catch (err) {
      pasteError = 'Gagal menempel dari clipboard. Silakan tempel manual (Ctrl+V) di kotak teks.';
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
</script>

<main>
  <header>
    <h1>🌸 Khotmil Qur'an 🕋</h1>
    <p class="subtitle">Pembuat teks pembagian tugas mengaji</p>
  </header>

  <section class="panel">
    <div class="panel-header">
      <label for="input">Teks periode ini</label>
      <div class="actions">
        <button type="button" onclick={handlePaste}>📋 Tempel</button>
        <button type="button" class="ghost" onclick={handleClear} disabled={!input}>Bersihkan</button>
      </div>
    </div>
    <textarea
      id="input"
      bind:value={input}
      placeholder="Tempel teks pembagian tugas mengaji di sini..."
      rows="16"
    ></textarea>
    {#if pasteError}
      <p class="error">{pasteError}</p>
    {/if}
    {#if input}
      <p class="hint">{juzCount} baris juz terdeteksi</p>
    {/if}
  </section>

  <section class="panel">
    <div class="panel-header">
      <label for="output">Teks periode berikutnya</label>
      <div class="actions">
        <button type="button" onclick={handleCopy} disabled={!output}>📄 Salin</button>
      </div>
    </div>
    <textarea id="output" value={output} placeholder="Hasil akan muncul di sini..." rows="16" readonly></textarea>
    {#if copyStatus}
      <p class="hint">{copyStatus}</p>
    {/if}
  </section>
</main>

<style>
  :global(body) {
    margin: 0;
    background: #f4f1ea;
    color: #2b2620;
    font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  }

  main {
    max-width: 960px;
    margin: 0 auto;
    padding: 1.5rem 1rem 3rem;
  }

  header {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  h1 {
    margin: 0 0 0.25rem;
    font-size: 1.6rem;
  }

  .subtitle {
    margin: 0;
    color: #6b6255;
    font-size: 0.95rem;
  }

  .panel {
    background: #fff;
    border: 1px solid #e2dccf;
    border-radius: 12px;
    padding: 1rem;
    margin-bottom: 1.25rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  label {
    font-weight: 600;
  }

  .actions {
    display: flex;
    gap: 0.5rem;
  }

  button {
    border: 1px solid #c9a24b;
    background: #c9a24b;
    color: #fff;
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
    color: #6b6255;
    border-color: #d8d2c3;
  }

  textarea {
    width: 100%;
    box-sizing: border-box;
    font-family: 'Segoe UI Emoji', ui-monospace, Consolas, monospace;
    font-size: 0.95rem;
    padding: 0.75rem;
    border: 1px solid #e2dccf;
    border-radius: 8px;
    resize: vertical;
    line-height: 1.5;
  }

  .hint {
    margin: 0.4rem 0 0;
    color: #6b6255;
    font-size: 0.85rem;
  }

  .error {
    margin: 0.4rem 0 0;
    color: #b3413b;
    font-size: 0.85rem;
  }
</style>
