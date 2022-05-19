function ItemDTO(code,name,price,qty) {
    var __iCode = code;
    var __iName = name;
    var __iPrice = price;
    var __iQty = qty;

    this.setItemCode = function(code){
        __iCode = code;
    }

    this.getItemCode = function(){
        return __iCode;
    }

    this.setItemName = function(name){
        __iName = name;
    }

    this.getItemName = function(){
        return __iName;
    }

    this.setItemPrice = function(price){
        __iPrice = price;
    }

    this.getItemPrice = function(){
        return __iPrice;
    }

    this.setItemQty = function(qty){
        __iQty = qty;
    }

    this.getItemQty = function(){
        return __iQty;
    }


}