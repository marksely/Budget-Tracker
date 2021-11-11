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