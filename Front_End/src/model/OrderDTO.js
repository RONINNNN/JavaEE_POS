function OrderDTO(orderId,customerId,date,discount,total,subTotal){
    var oId=orderId;
    var cId=customerId;
    var date=date;
    var discount=discount;
    var total=total;
    var subTotal=subTotal;

    this.setOrderId =function (orderId){
        oId=orderId;
    }
    this.getOrderId=function (){
        return oId;
    }


    this.setCustomerId =function (customerId){
        oId=customerId;
    }
    this.getCustomerId=function (){
        return cId;
    }

    this.setDate =function (date){
        date=date;
    }
    this.getDate=function (){
        return date;
    }

    this.setDiscount =function (discount){
        discount=discount;
    }
    this.getDiscount=function (){
        return discount;
    }

    this.setTotal =function (total){
        total=total;
    }
    this.getTotal=function (){
        return total;
    }

    this.setSubTotal =function (subTotal){
        subTotal=subTotal;
    }
    this.getSubTotal=function (){
        return subTotal;
    }
}