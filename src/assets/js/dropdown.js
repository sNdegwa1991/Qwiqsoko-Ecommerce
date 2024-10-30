function filter() {
    var keyword = document.getElementById("myInput").value;
    var select = document.getElementById("myDropdown");
    for (var i = 0; i < select.length; i++) {
        var txt = select.options[i].text;
        if (txt.substring(0, keyword.length).toLowerCase() !== keyword.toLowerCase() && keyword.trim() !== "") {
            select.options[i].style.display = 'none';
        } else {
            select.options[i].style.display = 'list-item';
        }
    }
}

function filterTable() {
    // Declare variables
    var input, filter, table, tr, td, i;
    input = document.getElementById("search-input");
    filter = input.value.toUpperCase();
    table = document.getElementById("table-products");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[5];
      if (td) {
        if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";

        } else {
          tr[i].style.display = "none";

        }
      }
    }
  }