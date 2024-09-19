import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
    const addForm = document.getElementById('addTaxPayerForm');
    const searchButton = document.getElementById('searchButton');
    const taxPayerList = document.getElementById('taxPayerList').getElementsByTagName('tbody')[0];
    const searchResult = document.getElementById('searchResult');

    addForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const tid = document.getElementById('tid').value;
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const address = document.getElementById('address').value;

        await backend.addTaxPayer(tid, firstName, lastName, address);
        addForm.reset();
        await updateTaxPayerList();
    });

    searchButton.addEventListener('click', async () => {
        const searchTid = document.getElementById('searchTid').value;
        const result = await backend.searchTaxPayer(searchTid);
        if (result.length > 0) {
            const taxPayer = result[0];
            searchResult.innerHTML = `
                <p>TID: ${taxPayer.tid}</p>
                <p>Name: ${taxPayer.firstName} ${taxPayer.lastName}</p>
                <p>Address: ${taxPayer.address}</p>
            `;
        } else {
            searchResult.innerHTML = '<p>No TaxPayer found with the given TID.</p>';
        }
    });

    async function updateTaxPayerList() {
        const taxPayers = await backend.getAllTaxPayers();
        taxPayerList.innerHTML = '';
        taxPayers.forEach(taxPayer => {
            const row = taxPayerList.insertRow();
            row.insertCell(0).textContent = taxPayer.tid;
            row.insertCell(1).textContent = taxPayer.firstName;
            row.insertCell(2).textContent = taxPayer.lastName;
            row.insertCell(3).textContent = taxPayer.address;
        });
    }

    await updateTaxPayerList();
});
