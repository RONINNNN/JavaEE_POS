generateOrderId();
setDate();
var selectedItemId;
var selectedCustomerId;

//////////////-load customer and item ids /////////////////////////////////////

$("#btnPurchase").click(function(){
    purchaseOrder();
});

$("#idCmb1").change(function (e){
     selectedCustomerId =$('#idCmb1').find(":selected").text();
    selectedCustomer(selectedCustomerId);
});


$("#idCmb2").change(function (e){
     selectedItemId =$('#idCmb2').find(":selected").text();
    selectedItem(selectedItemId);
});

$("#dis").keyup(function(event){

    discountCal();

});

$("#cash").keyup(function (event) {

    let subTotal = parseInt($("#lblSubTotal").text());
    let cash = parseInt($("#cash").val());
    let balance = cash - subTotal;
    $("#balance").val(balance);


});


/* load customer ids to cmb (customer)*/
function loadAllCustomerIds() {
    $("#idCmb1").empty();

    let cusHint=`<option disabled selected> Select Customer ID</option>`;

    $("#idCmb1").append(cusHint);

    for (let i in customerDB) {
        let option = `<option value="${customerDB[i].getCustomerID()}">${customerDB[i].getCustomerID()}</option>`
        $("#idCmb1").append(option);
    }
}
/*load customer data to text fields*/
function selectedCustomer(CustomerId){
    for (const i in customerDB){
        if (customerDB[i].getCustomerID()==CustomerId) {
            let element = customerDB[i];
            $("#cusName").val(element.getCustomerName());
            $("#salary").val(element.getCustomerSalary());
            $("#address").val(element.getCustomerAddress());
        }
    }
}


/* load item ids to cmb (item)*/
function loadAllItemIds() {
    $("#idCmb2").empty();

    let itemHint=`<option disabled selected> Select Item ID</option>`;

    $("#idCmb2").append(itemHint);

    for (let i in itemDB) {
        let option = `<option value="${itemDB[i].getItemCode()}">${itemDB[i].getItemCode()}</option>`
        $("#idCmb2").append(option);
    }
}
/*load item data to text fields*/
function selectedItem(ItemId){
    for (const i in itemDB){
        if (itemDB[i].getItemCode()==ItemId) {
            let element = itemDB[i];
            $("#Order-itemName").val(element.getItemName());
            $("#qtyOnHand").val(element.getItemQty());
            $("#price").val(element.getItemPrice());
        }
    }
}
////////////////////////////////////////////////////////////////////////////////////////

//generate order Id

function generateOrderId() {

    let index = orderDB.length - 1;
    let id;
    let temp;
    if (index != -1) {
        id = orderDB[orderDB.length - 1].getOrderId();
        temp = id.split("-")[1];
        temp++;
    }

    if (index == -1) {
        $("#oId").val("O00-001");
    } else if (temp <= 9) {
        $("#oId").val("O00-00" + temp);
    } else if (temp <= 99) {
        $("#oId").val("O00-0" + temp);
    } else {
        $("#oId").val("O00-" + temp);
    }

}

//set date

function setDate() {
    let d = new Date();
    let dd = d.toISOString().split("T")[0].split("-");
    $("#iDate").val(dd[0]+"-"+dd[1]+"-"+dd[2]);
    $("#iDate").text(dd[0]+"-"+dd[1]+"-"+dd[2]);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////


$("#btnAddToCart").click(function(){
    addItemToCart();
});

var fullTotal=0;

function addItemToCart(){
    let id = selectedItemId;
    let iName = $("#Order-itemName").val();
    let iQtyOnHand = parseInt($("#qtyOnHand").val());
    let iPrice = $("#price").val();
    let iOrderQTY = parseInt($("#oQty").val());

    let total = 0;

    if (iQtyOnHand+1 <= iOrderQTY) {
        alert("Enter Valid QTY");
        $("#oQty").val("");
        return;
    }
    iQtyOnHand = iQtyOnHand - iOrderQTY;

    //updateing qty
    for (let i = 0; i < itemDB.length; i++) {
        if (id == itemDB[i].getItemCode()) {
            itemDB[i].setItemQty(iQtyOnHand);
        }
    }
    let newQty = 0;
    let newTotal= 0;


    if (checkDuplicates(id)==-1){
        total = iOrderQTY * iPrice;
        fullTotal = fullTotal + total;
        let row =
            `<tr><td>${id}</td><td>${iName}</td><td>${iPrice}</td><td>${iOrderQTY}<td>${total}</td></tr>`;
        $("#tbodyOrder").append(row);
        $("#lblFullTotal").text(fullTotal+" LKR");
        $("#lblSubTotal").text(fullTotal+" LKR");

        // alert("23445");
        clearInputItems();

    }


    else{

        let rowNo = checkDuplicates(id);
        newQty = iOrderQTY;
        let oldQty = parseInt($($('#tbodyOrder>tr').eq(rowNo).children(":eq(3)")).text());
        let oldTotal = parseInt($($('#tbodyOrder>tr').eq(rowNo).children(":eq(4)")).text());

        fullTotal = fullTotal-oldTotal;
        newQty = parseInt(oldQty) + parseInt(newQty) ;
        newTotal = newQty * iPrice;
        fullTotal = fullTotal + newTotal;

        //Update row
        $('#tbodyOrder tr').eq(rowNo).children(":eq(3)").text(newQty);
        $('#tbodyOrder tr').eq(rowNo).children(":eq(4)").text(newTotal);

        $("#lblFullTotal").text(fullTotal+" LKR");
        $("#lblSubTotal").text(fullTotal+" LKR");
        // alert("test");
        clearInputItems();
    }


}
function clearInputItems() {
    $("#idCmb2").val("");
    $("#Order-itemName").val("");
    $("#qtyOnHand").val("");
    $("#price").val("");
    $("#oQty").val("");
}

function checkDuplicates(itemId) {
    for (let i = 0; i < $("#tbodyOrder > tr").length; i++) {
        if (itemId == $('#tbodyOrder').children().eq(i).children().eq(0).text()) {
            // alert(i);
            return i;
        }

    }
    return -1;
}

function purchaseOrder() {

    let orderId = $("#oId").val();
    let customer = selectedCustomerId;
    let orderDate = $("#iDate").val();
    let discount = parseInt($("#dis").val());
    let total = $("#lblFullTotal").text();
    let subTotal = $("#lblSubTotal").text();

    var orderObj = new OrderDTO(orderId,customer,orderDate,discount,total,subTotal);
    orderDB.push(orderObj);

    for (let i = 0; i < $('#tbodyOrder tr').length; i++) {

        tblItemId = $('#tbodyOrder').children().eq(i).children().eq(0).text();
        tblItemName = $('#tbodyOrder').children().eq(i).children().eq(1).text();
        tblItemPrice = $('#tbodyOrder').children().eq(i).children().eq(2).text();
        tblItemQty = $('#tbodyOrder').children().eq(i).children().eq(3).text();
        tblItemTotal = $('#tbodyOrder').children().eq(i).children().eq(4).text();

        var orderDetailObj = new OrderDetailDTO(orderId,tblItemId,tblItemName,tblItemPrice,tblItemQty,tblItemTotal);
        orderDetailsDB.push(orderDetailObj);
    }
    alert("SUCCESS YOUR ORDER");
    generateOrderId();

}

function discountCal() {
    var discount =0;
    var discounted_price=0;
    var tempDiscount=0;

    discount = parseInt($("#dis").val());
    tempDiscount = 100-discount;
    discounted_price = (tempDiscount*fullTotal)/100;
    $("#lblSubTotal").text(discounted_price +" LKR");

}






