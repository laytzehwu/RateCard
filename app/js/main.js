var Checkout = function (pricelist) {
    var pricelist = pricelist || [];
    var getBasicPrice = function (productId) {
        return pricelist.find(function (product) {
            return product.id === productId;
        });
    }
    var cart = {};
    this.cart = cart;
    this.add = function (productId) {
        var productPrice = getBasicPrice(productId);
        if( productPrice) {
            if(!cart.hasOwnProperty(productId)) {
                cart[productId] = {
                    qty: 0
                };
            }
            cart[productId].qty ++;
        } else {
            throw new Error('Product not found');
        }
    }
    
    this.remove = function (productId) {
        if(cart.hasOwnProperty(productId)) {
            delete cart[productId];
        }
    }
    
    var calculatePrice = function () {
        var me = this;
        Object.keys(cart).forEach(function (productId) {
            var item = cart[productId];
            item.subTotal = item.qty * getBasicPrice(productId).price;
        });
    }
    
    this.total = function () {
        calculatePrice();
        var total = 0;
        var me = this;
        Object.keys(this.cart).forEach(function (productId) {
            var item = me.cart[productId];
            total += item.subTotal;
        });
        return total;
    }
}