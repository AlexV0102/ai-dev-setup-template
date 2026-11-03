import { fetchGreeting } from './api.ts';

export function mountGreeting(root: HTMLElement) {
  root.innerHTML = `
    <h1>Greeting</h1>
    <form>
      <label for="name">Your name</label>
      <input id="name" name="name" maxlength="40" autocomplete="given-name" />
      <button type="submit">Say hello</button>
    </form>
    <p role="status" aria-live="polite"></p>
  `;
  const form = root.querySelector('form')!;
  const input = root.querySelector('input')!;
  const status = root.querySelector<HTMLElement>('[role="status"]')!;
  const button = root.querySelector('button')!;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    button.disabled = true;
    status.textContent = 'Loading…';
    try {
      status.textContent = (await fetchGreeting(input.value)).message;
    } catch {
      status.textContent = 'Could not load the greeting. Try again.';
    } finally {
      button.disabled = false;
    }
  });
}
