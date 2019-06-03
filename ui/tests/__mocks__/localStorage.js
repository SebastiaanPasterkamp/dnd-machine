class LocalStorage {
      store = {};
      setItem = (key, val) => (this.store[key] = val);
      getItem = key => this.store[key];
      removeItem = key => { delete this.store[key]; };
      clear = () => (this.store = {});
};

const localStorage = new LocalStorage();

export {
    LocalStorage,
    localStorage,
};
