const database = new EventTarget();
let _db;
let filesDb;

const req = indexedDB.open('files', 1);

req.onerror = error => console.error(error);

req.onupgradeneeded = event => {
  _db = event.target.result;

  filesDb = _db.createObjectStore('files', {
    autoIncrement: true,
    keyPath: 'id',
  });
};

req.onsuccess = ev => {
  _db = ev.target.result;

  database.dispatchEvent(new CustomEvent('open'));
};

database.addEventListener('newFile', event => {
  const tx = _db.transaction(['files'], 'readwrite');
  const store = tx.objectStore('files');
  console.log('db', event.detail);

  store.add(event.detail);
});

database.getFiles = () => new Promise((resolve, reject) => {
  const tx = _db.transaction(['files'], 'readwrite');
  const store = tx.objectStore('files');

  const r = store.getAll()

  r.onerror = error => reject(error);
  r.onsuccess = event => resolve(event.target.result);
});

export default database;
