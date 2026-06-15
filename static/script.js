document.addEventListener('DOMContentLoaded', () => { // wait for the DOM (Document Object Model) to be fully loaded before running the script
    // get references to buttons and forms
    const btnA = document.getElementById('expense-form-btn');
    const btnB = document.getElementById('bill-form-btn');
    const formA = document.getElementById('add-expense-form');
    const formB = document.getElementById('add-bill-form');

    // filter functionality for expenses and bills table
    const filterBtns = document.querySelectorAll('[data-filter]');
    const rows = document.querySelectorAll('#expenses-bills-table tbody tr');

    filterBtns.forEach(btn => { 
        btn.addEventListener('click', () => { // add click event listener to each filter button
            const filter = btn.dataset.filter; // get the filter type from the button's "data-filter" attribute

            // update "active" button styling
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            //filter rows
            rows.forEach(row => {
                if (filter === 'all') {
                    row.style.display = '';
                } else {
                    row.style.display = row.dataset.type === filter ? '' : 'none'; // show row if it matches the filter type, otherwise hide it
                }
            });
        });
    });

    function toggleForm(showForm, hideForm) { // function to toggle the visibility of the forms
        if (!showForm || !hideForm) return;
        if (showForm.style.display === 'block') {
            showForm.style.display = 'none';
        } else {
            showForm.style.display = 'block';
            hideForm.style.display = 'none';
        }
    }

    if (btnA && btnB && formA && formB) { // check if the buttons and forms exist before adding event listeners
        btnA.addEventListener('click', () => {
            toggleForm(formA, formB);
        });

        btnB.addEventListener('click', () => { 
            toggleForm(formB, formA);
        });
    }
});