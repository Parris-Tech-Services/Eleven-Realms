import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';

const code = readFileSync(resolve(__dirname, '../public/podcast-player.js'), 'utf8');
const html = '<body><section class="log-panel"></section><label><input id="setting-podcasts" type="checkbox"></label></body>';

function load(stored?: string) {
  const dom = new JSDOM(html, { url: 'http://game.test/', runScripts: 'outside-only' });
  const w = dom.window;
  if (stored !== undefined) w.localStorage.setItem('eleven-realms-podcasts-enabled-v1', stored);
  w.eval(code);
  return w;
}

describe('podcast player default', () => {
  it('is hidden on a first visit and the setting is unticked', () => {
    const w = load();
    expect(w.document.querySelector('#er-podcast-launcher')).toBeNull();
    expect((w.document.querySelector('#setting-podcasts') as HTMLInputElement).checked).toBe(false);
  });

  it('shows the launcher once the setting is ticked and remembers it', () => {
    const w = load();
    const box = w.document.querySelector('#setting-podcasts') as HTMLInputElement;
    box.checked = true;
    box.dispatchEvent(new w.Event('change', { bubbles: true }));
    expect(w.document.querySelector('#er-podcast-launcher')).not.toBeNull();
    expect(w.localStorage.getItem('eleven-realms-podcasts-enabled-v1')).toBe('1');
    expect(load('1').document.querySelector('#er-podcast-launcher')).not.toBeNull();
  });

  it('hides it again when unticked', () => {
    const w = load('1');
    const box = w.document.querySelector('#setting-podcasts') as HTMLInputElement;
    expect(box.checked).toBe(true);
    box.checked = false;
    box.dispatchEvent(new w.Event('change', { bubbles: true }));
    expect(w.document.querySelector('#er-podcast-launcher')).toBeNull();
    expect(load('0').document.querySelector('#er-podcast-launcher')).toBeNull();
  });
});
