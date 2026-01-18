const STORAGE_KEY = "savedTracks";

export const addToDB = (item) => {
  const current = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  const exists = current.some((i) => i.id === item.id);
  if (!exists) {
    current.push(item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  }
};

export const loadFromDB = () => {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  return saved;
};
