$("#btnAddCus").prop('disabled', true);
var clickedRowCId;
/* Validation - Start */
$('#error1').css({"display": "none"});
$('#error2').css({"display": "none"});
$('#error3').css({"display": "none"});
$('#error4').css({"display": "none"});


// var regExCusID = /^(C00-)[0-9]{3,4}$/;
var RegExCusName = /^[A-z ]{5,20}$/;
var RegExCusAddress = /^[0-9/A-z. ,]{5,}$/;
var RegExCusSalary = /^[0-9]{1,}[.]?[0-9]{1,2}$/;

/* Functions Call Section - Start */

// Customer Validation Function Call - Start
// validation(regExCusID, '#cusIdAdd', '#error1', '#cusNameAdd', '#btnAddCus');
validation(RegExCusName, '#cusNameAdd', '#error2', '#cusAddressAdd', '#btnAddCus');
validation(RegExCusAddress, '#cusAddressAdd', '#error3', '#cusSalaryAdd', '#btnAddCus');
validation(RegExCusSalary, '#cusSalaryAdd', '#error4', "#btnAddCus", '#btnAddCus');


generateId();   //Generate New Customer ID
loadAllCustomers(); //load all customers
clearSearch(); //Clear Search and Refresh table
disableEdit();  //Prevent Editing Customer ID
// deleteCustomer();

/* Functions Call Section - End */


// Customer Validation Function - Start
function validation(regEx, id, error, nextId, btn) {
    $(id).keyup(function (event) {
        let input = $(id).val();
        if (regEx.test(input)) {
            $(id).css({'border': '2px solid green', 'background-color': '#fff'});
            $(error).css({"display": "none"});
            if (event.key == "Enter") {
                $(btn).prop('disabled', false);
                $(nextId).focus();
            }
        } else {
            $(id).css({'border': '2px solid red', 'background-color': '#ffe6e6'});
            $(error).css({"color": "red", "display": "block"});
            $(btn).prop('disabled', true);
        }
    });
}

// Customer Validation Function - End

// Customer Add Function - Start

    $("#btnAddCus").click(function () {
       // console.log( $("#customerForm").serialize())
        $.ajax({
            url:"http://localhost:8080/JavaEE/customer",
            method: "POST",data: $("#cusForm").serialize(),
            success: function (resp) {
                if (resp.status == 200) {
                    clearFields();
                    loadAllCustomers();
                    generateId();
                    loadAllCustomerIds();
                } else {
                    alert(resp.data)
                }
            },
            error: function (ob, textStatus, error) {
                console.log(ob);
                console.log(textStatus);
                console.log(error);
            }


        });
/*
        let custId = $("#cusIdAdd").val();
        let custName = $("#cusNameAdd").val();
        let custAddress = $("#cusAddressAdd").val();
        let custSalary = $("#cusSalaryAdd").val();


        var customerObj = new CustomerDTO(custId, custName, custAddress, custSalary);
        customerDB.push(customerObj);

        loadAllCustomers(); //load all customers
        clearFields()   //Clear Input Fields
        generateId();
        loadAllCustomerIds();*/
    });


// Customer Add Function - End


// Load All Customers Function - Start
function loadAllCustomers() {
    $("#cusTblBody").empty();//Duplicate Old rows remove

    $.ajax({
        url: "http://localhost:8080/JavaEE/customer?option=GETALL",
        method: "GET",
        success: function (resp) {
            for (const customer of resp.data) {
                let nRow =
                    "<tr><td>" +
                    customer.id +
                    "</td><td>" +
                    customer.name +
                    "</td><td>" +
                    customer.address +
                    "</td><td>" +
                    customer.salary +
                    "</td></tr>";

                $("#cusTblBody").append(nRow);
                bindCustomerRow();
                deleteCustomer();
            }
        }

    })
    /* for (let i = 0; i < customerDB.length; i++) {
         let nRow =
             "<tr><td>" +
             customerDB[i].getCustomerID() +
             "</td><td>" +
             customerDB[i].getCustomerName() +
             "</td><td>" +
             customerDB[i].getCustomerAddress() +
             "</td><td>" +
             customerDB[i].getCustomerSalary() +
             "</td></tr>";

         $("#cusTblBody").append(nRow);
         bindCustomerRow();
         deleteCustomer();
     }*/
}


// Load All Customers Function - End


// Bind Events Customer Row Function - Start
function bindCustomerRow() {
    $("#cusTblBody>tr").click(function () {

        clickedRowCId = $(this).children(":eq(0)").text();
        let custName = $(this).children(":eq(1)").text();
        let custAddress = $(this).children(":eq(2)").text();
        let custSalary = $(this).children(":eq(3)").text();

        $("#cusIdAdd").val(clickedRowCId);
        $("#cusNameAdd").val(custName);
        $("#cusAddressAdd").val(custAddress);
        $("#cusSalaryAdd").val(custSalary);
    });
}

// Bind Events Customer Row - End

$("#button-cus-search").click(function () {

    var searchId = $("#txt-cus-search").val();
    var response = searchCustomer(searchId);
    if (response) {
        $("#cusTblBody").empty();
        let nRow =
            "<tr><td>" +
            response.getCustomerID() +
            "</td><td>" +
            response.getCustomerName() +
            "</td><td>" +
            response.getCustomerAddress() +
            "</td><td>" +
            response.getCustomerSalary() +
            "</td></tr>";
        $("#cusTblBody").append(nRow);
        bindCustomerRow();
        deleteCustomer();
    } else {
        alert("No Such a customer");
        clearSearch(); //Clear Search and Refresh table
    }
});

function searchCustomer(id) {
    for (let i = 0; i < customerDB.length; i++) {
        if (customerDB[i].getCustomerID() == id) {
            return customerDB[i];
        }
    }
}

//clear search function - start
function clearSearch() {
    $("#clear-btn-cus").click(function () {
        loadAllCustomers(); //load all customers
        clearFields()   //Clear Input Fields
    });
}

//clear search function - End

//Delete Customer Function - Start
function deleteCustomer() {
    $("#cus-delete").click(function (){
        let getClickData=$("#cusIdAdd").val();
        $.ajax({
            url:`http://localhost:8080/JavaEE/customer?customerID=${getClickData}`,
        method:"DELETE",
            success:function (resp){
            if (resp.status==200){
                loadAllCustomers();
            }else{
                alert(resp.data);
            }
        }
    });
        /*let getClickData=$("#Id").val();
        for (let i=0;i<customerDB.length;i++){
            if (customerDB[i].getCustomerId()==getClickData){
                customerDB.splice(i, 1);
            }
        }
        clearField();
        addDataToTable();
        generateId();*/
    });
   /* $("#cus-delete").click(function () {
        for (let i = 0; i < customerDB.length; i++) {
            // console.log(customerDB[i].getCustomerID());
            if (customerDB[i].getCustomerID() == clickedRowCId) {
                customerDB.splice(i, 1);
            }
        }
        loadAllCustomers();
        clearFields()   //Clear Input Fields

    });*/
}

//Update Customer Function - End

$("#btnUpdateCus").click(function () {
    var cusOb = {
        id: $("#cusIdAdd").val(),
        name: $("#cusNameAdd").val(),
        address: $("#cusAddressAdd").val(),
        salary: $("#cusSalaryAdd").val()
    }

    $.ajax({
        url: "http://localhost:8080/JavaEE/customer", method: "PUT", // contentType: "application/json",
        data: JSON.stringify(cusOb), success: function (resp) {
            if (resp.status == 200) {
                addDataToTable();
                clearField();   //Clear Input Fields
            } else if (resp.status == 400) {
                alert(resp.data);
            }
        }
    });

    /* let custId = $("#cusIdAdd").val();
     let custName = $("#cusNameAdd").val();
     let custAddress = $("#cusAddressAdd").val();
     let custSalary = $("#cusSalaryAdd").val();

     for (let i = 0; i < customerDB.length; i++) {
         if (customerDB[i].getCustomerID() == custId) {
             customerDB[i].setCustomerName(custName);
             customerDB[i].setCustomerAddress(custAddress);
             customerDB[i].setCustomerSalary(custSalary);
         }
     }*/
     loadAllCustomers();
     clearFields()   //Clear Input Fields
 });

    function generateId() {
        $.ajax({
            url:"http://localhost:8080/JavaEE/customer?option=GenId",
            method:"GET",
            success:function (resp){
                if (resp.status==200){
                    $("#cusIdAdd").val(resp.data.id);
                }else{
                    alert(resp.data)
                }
            }
        });
       /* let index = customerDB.length - 1;
        let id;
        let temp;
        if (index != -1) {
            id = customerDB[customerDB.length - 1].getCustomerID();
            temp = id.split("-")[1];
            temp++;
        }

        if (index == -1) {
            $("#cusIdAdd").val("C00-001");
        } else if (temp <= 9) {
            $("#cusIdAdd").val("C00-00" + temp);
        } else if (temp <= 99) {
            $("#cusIdAdd").val("C00-0" + temp);
        } else {
            $("#cusIdAdd").val("C00-" + temp);
        }*/
    }

    function disableEdit() {
        $("#cusIdAdd").css("pointer-events", "none");
    }

    function clearFields() {
        $("#cusNameAdd,#cusAddressAdd,#cusSalaryAdd,#txt-cus-search").val("");    // Clear input Fields (Add)

    }
