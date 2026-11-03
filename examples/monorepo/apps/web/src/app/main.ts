import { mountGreeting } from '../features/greeting/index.ts';

const root = document.querySelector<HTMLElement>('#app');
if (root) mountGreeting(root);
