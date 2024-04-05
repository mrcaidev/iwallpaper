export function getLocalStorage(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setLocalStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    return;
  }
}

export function removeLocalStorage(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    return;
  }
}
