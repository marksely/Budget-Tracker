let db;
let budgetTracker;

const request = indexedDB.open('BudgetDB', budgetTracker || 21);

request.onupgradeneeded = function (event) {
    const { oldVersion } = event;
    const newVersion = e.newVersion || db.version;

    db = event.target.result;

    if(db.objectStoreNames.length === 0) {
        db.createObjectStore('BudgetStore', { autoIncrement: true});
    }
};

request.onerror = function (event) {
    console.log(`Error, ${event.target.errorCode}`);
}

function databaseCheck() {
    let transaction = db.transaction(['BudgetStore'], 'readwrite');

    const store = transaction.objectStore('BudgetStore');

    const getAll = store.getAll();

    getAll.onsuccess = function () {
        if(getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept : 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => {
                response.json()
            })
            .then((res) => {
                if(res.length !== 0) {
                    transaction = db.transaction(['BudgetStore'], 'readwrite');
                    const currentStore = transaction.objectStore('BudgetStore');

                    currentStore.clear();
                }
            })
        }
    }
}

request.onsuccess = function (event) {
    db = event.target.result;

    if(navigator.onLine) {
        databaseCheck();
    }
};

const saveRecord = (record) => {
    const transaction = db.transaction(['BudgetStore'], 'readwrite');

    const store = transaction.objectStore('BudgetStore');

    store.add(record);
};

window.addEventListener('online', databaseCheck);