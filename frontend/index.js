import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
    const addForm = document.getElementById('addTaxPayerForm');
    const searchButton = document.getElementById('searchButton');
    const taxPayerList = document.getElementById('taxPayerList').getElementsByTagName('tbody')[0];
    const searchResult = document.getElementById('searchResult');
    const updateModal = document.getElementById('updateModal');
    const addModal = document.getElementById('addModal');
    const updateForm = document.getElementById('updateTaxPayerForm');
    const closeButtons = document.getElementsByClassName('close');
    const openAddModalButton = document.getElementById('openAddModal');

    openAddModalButton.onclick = function() {
        addModal.style.display = "block";
    }

    addForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const tid = document.getElementById('tid').value;
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const address = document.getElementById('address').value;

        await backend.addTaxPayer(tid, firstName, lastName, address);
        addForm.reset();
        addModal.style.display = "none";
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

    updateForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const tid = document.getElementById('updateTid').value;
        const firstName = document.getElementById('updateFirstName').value;
        const lastName = document.getElementById('updateLastName').value;
        const address = document.getElementById('updateAddress').value;

        await backend.updateTaxPayer(tid, firstName, lastName, address);
        updateModal.style.display = "none";
        await updateTaxPayerList();
    });

    Array.from(closeButtons).forEach(button => {
        button.onclick = function() {
            addModal.style.display = "none";
            updateModal.style.display = "none";
        }
    });

    window.onclick = function(event) {
        if (event.target == addModal) {
            addModal.style.display = "none";
        }
        if (event.target == updateModal) {
            updateModal.style.display = "none";
        }
    }

    async function updateTaxPayerList() {
        const taxPayers = await backend.getAllTaxPayers();
        taxPayerList.innerHTML = '';
        taxPayers.forEach(taxPayer => {
            const row = taxPayerList.insertRow();
            row.insertCell(0).textContent = taxPayer.tid;
            row.insertCell(1).textContent = taxPayer.firstName;
            row.insertCell(2).textContent = taxPayer.lastName;
            row.insertCell(3).textContent = taxPayer.address;
            
            const actionsCell = row.insertCell(4);
            const updateButton = document.createElement('button');
            updateButton.textContent = 'Update';
            updateButton.onclick = () => openUpdateModal(taxPayer);
            actionsCell.appendChild(updateButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteTaxPayer(taxPayer.tid);
            actionsCell.appendChild(deleteButton);
        });
    }

    function openUpdateModal(taxPayer) {
        document.getElementById('updateTid').value = taxPayer.tid;
        document.getElementById('updateFirstName').value = taxPayer.firstName;
        document.getElementById('updateLastName').value = taxPayer.lastName;
        document.getElementById('updateAddress').value = taxPayer.address;
        updateModal.style.display = "block";
    }

    async function deleteTaxPayer(tid) {
        if (confirm('Are you sure you want to delete this TaxPayer?')) {
            await backend.deleteTaxPayer(tid);
            await updateTaxPayerList();
        }
    }

    await updateTaxPayerList();
});
