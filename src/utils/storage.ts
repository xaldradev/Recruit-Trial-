export function getStorageItem(key: string): string | null {
  const arohiKey = key.startsWith('arohi_') ? key : `arohi_${key.replace(/^recruit_/, '')}`;
  const recruitKey = key.startsWith('recruit_') ? key : `recruit_${key.replace(/^arohi_/, '')}`;
  return localStorage.getItem(arohiKey) ?? localStorage.getItem(recruitKey);
}

export function setStorageItem(key: string, value: string): void {
  const arohiKey = key.startsWith('arohi_') ? key : `arohi_${key.replace(/^recruit_/, '')}`;
  const recruitKey = key.startsWith('recruit_') ? key : `recruit_${key.replace(/^arohi_/, '')}`;
  try {
    localStorage.setItem(arohiKey, value);
    localStorage.setItem(recruitKey, value);
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}
