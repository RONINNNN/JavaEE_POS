function CustomerDTO(id,name,address,salary) {
    var __cID =id;
    var __cName = name;
    var __cAddress = address;
    var __cSalary =salary;

    this.getCustomerID = function () {
        return __cID;
    }

    this.setCustomerID = function (id) {
        __cID=id;
    }

    this.getCustomerName = function () {
        return __cName;
    }

    this.setCustomerName = function (name) {
        __cName=name;
    }

    this.getCustomerAddress = function () {
        return __cAddress;
    }

    this.setCustomerAddress = function (address) {
        __cAddress=address;
    }

    this.getCustomerSalary = function () {
        return __cSalary;
    }

    this.setCustomerSalary = function (salary) {
        __cSalary=salary;
    }


}
