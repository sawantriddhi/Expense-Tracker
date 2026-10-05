let transactions =
    JSON.parse(
        localStorage.getItem("transactions")
    ) || [];


/* CHECK CUSTOM CATEGORY */

function checkCustomCategory() {

    let category =
        document.getElementById("category").value;

    let customInput =
        document.getElementById("customCategory");


    if (category === "Other") {

        customInput.style.display = "block";

    } else {

        customInput.style.display = "none";

        customInput.value = "";

    }

}



/* ADD TRANSACTION */

function addTransaction() {

    let title =
        document.getElementById("title")
        .value
        .trim();


    let amount =
        Number(
            document.getElementById("amount").value
        );


    let type =
        document.getElementById("type").value;


    let category =
        document.getElementById("category").value;


    let customCategory =
        document.getElementById("customCategory")
        .value
        .trim();


    if (title === "" || amount <= 0) {

        alert(
            "Please enter a valid title and amount."
        );

        return;

    }


    /* CUSTOM CATEGORY */

    if (
        category === "Other" &&
        customCategory !== ""
    ) {

        category = customCategory;

    }


    let transaction = {

        id: Date.now(),

        title: title,

        amount: amount,

        type: type,

        category: category

    };


    transactions.push(transaction);


    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );


    document.getElementById("title").value = "";

    document.getElementById("amount").value = "";

    document.getElementById("customCategory").value = "";

    document.getElementById("customCategory")
        .style.display = "none";

    document.getElementById("category").value = "Food";


    updateAll();

}



/* DELETE */

function deleteTransaction(id) {

    transactions =
        transactions.filter(
            function(transaction) {

                return transaction.id !== id;

            }
        );


    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );


    updateAll();

}



/* DISPLAY TRANSACTIONS */

function displayTransactions() {

    let list =
        document.getElementById(
            "transactionList"
        );


    let search =
        document.getElementById("search")
        .value
        .toLowerCase();


    list.innerHTML = "";


    let filtered =
        transactions.filter(
            function(transaction) {

                return (
                    transaction.title
                        .toLowerCase()
                        .includes(search)

                    ||

                    transaction.category
                        .toLowerCase()
                        .includes(search)
                );

            }
        );


    document.getElementById(
        "transactionCount"
    ).innerText =
        filtered.length +
        (
            filtered.length === 1
                ? " Transaction"
                : " Transactions"
        );


    if (filtered.length === 0) {

        list.innerHTML =
            "<p>No transactions found.</p>";

        return;

    }


    filtered.forEach(
        function(transaction) {

            let div =
                document.createElement("div");


            div.className =
                "transaction " +
                transaction.type;


            let sign =
                transaction.type === "income"
                    ? "+"
                    : "-";


            div.innerHTML = `

                <div>

                    <strong>
                        ${transaction.title}
                    </strong>

                    <br>

                    <small>
                        ${transaction.category}
                    </small>

                </div>


                <div>

                    <strong>
                        ${sign} ₹${transaction.amount}
                    </strong>

                    <br>

                    <button
                        onclick="deleteTransaction(${transaction.id})">
                        Delete
                    </button>

                </div>

            `;


            list.appendChild(div);

        }
    );

}



/* SUMMARY */

function updateSummary() {

    let income = 0;

    let expense = 0;


    transactions.forEach(
        function(transaction) {

            if (
                transaction.type === "income"
            ) {

                income += transaction.amount;

            } else {

                expense += transaction.amount;

            }

        }
    );


    let balance =
        income - expense;


    document.getElementById(
        "income"
    ).innerText =
        "₹" + income;


    document.getElementById(
        "expense"
    ).innerText =
        "₹" + expense;


    document.getElementById(
        "balance"
    ).innerText =
        "₹" + balance;


    document.getElementById(
        "chartIncome"
    ).innerText =
        "₹" + income;


    document.getElementById(
        "chartExpense"
    ).innerText =
        "₹" + expense;


    document.getElementById(
        "incomeExpense"
    ).innerText =
        "₹" + income + " / ₹" + expense;

}



/* SPENDING OVERVIEW */

function updateOverview() {

    let categoryAmounts = {};

    let totalExpense = 0;


    /* CALCULATE CATEGORY AMOUNTS */

    transactions.forEach(
        function(transaction) {

            if (
                transaction.type === "expense"
            ) {

                totalExpense +=
                    transaction.amount;


                if (
                    categoryAmounts[
                        transaction.category
                    ] === undefined
                ) {

                    categoryAmounts[
                        transaction.category
                    ] = 0;

                }


                categoryAmounts[
                    transaction.category
                ] += transaction.amount;

            }

        }
    );



    /* TOTAL SPENDING */

    document.getElementById(
        "overviewTotal"
    ).innerText =
        "₹" + totalExpense;


    document.getElementById(
        "totalSpending"
    ).innerText =
        "Total: ₹" + totalExpense;



    /* AVERAGE EXPENSE */

    let expenseTransactions =
        transactions.filter(
            function(transaction) {

                return (
                    transaction.type === "expense"
                );

            }
        );


    let average = 0;


    if (
        expenseTransactions.length > 0
    ) {

        average =
            totalExpense /
            expenseTransactions.length;

    }


    document.getElementById(
        "averageExpense"
    ).innerText =
        "₹" + Math.round(average);



    /* HIGHEST CATEGORY */

    let highestCategory = "-";

    let highestAmount = 0;


    for (
        let category in categoryAmounts
    ) {

        if (
            categoryAmounts[category]
            > highestAmount
        ) {

            highestAmount =
                categoryAmounts[category];

            highestCategory =
                category;

        }

    }


    document.getElementById(
        "highestCategory"
    ).innerText =
        highestCategory;



    /* FIXED CATEGORIES */

    updateCategory(
        "Food",
        "foodName",
        "foodAmount",
        "foodBar",
        "🍔 "
    );


    updateCategory(
        "Travel",
        "travelName",
        "travelAmount",
        "travelBar",
        "✈️ "
    );


    updateCategory(
        "Education",
        "educationName",
        "educationAmount",
        "educationBar",
        "📚 "
    );


    updateCategory(
        "Shopping",
        "shoppingName",
        "shoppingAmount",
        "shoppingBar",
        "🛍️ "
    );



    /* CUSTOM CATEGORIES */

    createCustomCategories(
        categoryAmounts,
        totalExpense
    );

}



/* CREATE CUSTOM CATEGORY BARS */

function createCustomCategories(
    categoryAmounts,
    totalExpense
) {

    let container =
        document.getElementById(
            "customCategories"
        );


    /* SAFETY CHECK */

    if (!container) {

        return;

    }


    container.innerHTML = "";


    let fixedCategories = [
        "Food",
        "Travel",
        "Education",
        "Shopping"
    ];


    let customCategories = [];


    /* FIND ALL CUSTOM CATEGORIES */

    for (
        let category in categoryAmounts
    ) {

        if (
            !fixedCategories.includes(category)
        ) {

            customCategories.push(category);

        }

    }



    /* IF NO CUSTOM CATEGORY */

    if (
        customCategories.length === 0
    ) {

        container.innerHTML = `

            <div class="category-item">

                <div class="category-name">

                    <span>
                        📦 Other
                    </span>

                    <span>
                        ₹0
                    </span>

                </div>


                <div class="progress">

                    <div
                        class="progress-bar other"
                        style="width: 0%;">
                    </div>

                </div>

            </div>

        `;

        return;

    }



    /* SHOW EVERY CUSTOM CATEGORY */

    customCategories.forEach(
        function(category) {

            let amount =
                categoryAmounts[category];


            let percentage = 0;


            if (
                totalExpense > 0
            ) {

                percentage =
                    (
                        amount /
                        totalExpense
                    ) * 100;

            }


            let div =
                document.createElement("div");


            div.className =
                "category-item";


            div.innerHTML = `

                <div class="category-name">

                    <span>
                        📦 ${category}
                    </span>

                    <span>
                        ₹${amount}
                    </span>

                </div>


                <div class="progress">

                    <div
                        class="progress-bar other"
                        style="width: ${percentage}%;">
                    </div>

                </div>

            `;


            container.appendChild(div);

        }
    );

}



/* CATEGORY UPDATE */

function updateCategory(
    category,
    nameId,
    amountId,
    barId,
    emoji
) {

    let amount = 0;


    transactions.forEach(
        function(transaction) {

            if (
                transaction.type === "expense" &&
                transaction.category === category
            ) {

                amount +=
                    transaction.amount;

            }

        }
    );


    document.getElementById(
        nameId
    ).innerText =
        emoji + category;


    document.getElementById(
        amountId
    ).innerText =
        "₹" + amount;



    let totalExpense = 0;


    transactions.forEach(
        function(transaction) {

            if (
                transaction.type === "expense"
            ) {

                totalExpense +=
                    transaction.amount;

            }

        }
    );


    let percentage = 0;


    if (
        totalExpense > 0
    ) {

        percentage =
            (
                amount /
                totalExpense
            ) * 100;

    }


    document.getElementById(
        barId
    ).style.width =
        percentage + "%";

}



/* DARK MODE */

function toggleDarkMode() {

    document.body.classList.toggle(
        "dark"
    );


    let button =
        document.querySelector(
            ".mode-btn"
        );


    if (
        document.body.classList.contains(
            "dark"
        )
    ) {

        button.innerText =
            "☀️ Light Mode";

    } else {

        button.innerText =
            "🌙 Dark Mode";

    }

}



/* UPDATE EVERYTHING */

function updateAll() {

    updateSummary();

    displayTransactions();

    updateOverview();

}



/* LOAD */

updateAll();