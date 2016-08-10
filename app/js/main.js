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
    
    var discountPrice;
    this.setDiscount = function (discount) {
        discountPrice = discount;
    }
    
    var calculatePrice = function () {
        var me = this;
        Object.keys(cart).forEach(function (productId) {
            var item = cart[productId];
            var basicPrice = getBasicPrice(productId).price;
            item.subTotal = item.qty * basicPrice;
            
            if(discountPrice && discountPrice.hasOwnProperty(productId)) {
                var productDiscount = discountPrice[productId];
                
                if(productDiscount.hasOwnProperty('qty')) {
                    if(productDiscount.qty <= item.qty) {
                        item.subTotal = Math.floor(item.qty/productDiscount.qty) * productDiscount.price;
                        item.subTotal += (item.qty % productDiscount.qty) * basicPrice;
                    }
                } else if(productDiscount.hasOwnProperty('minQty')) {
                    if(productDiscount.minQty <= item.qty) {
                        item.subTotal = item.qty * productDiscount.price;
                    }
                } else {
                    item.subTotal = item.qty * productDiscount.price;
                }
            }
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