'use stict';

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

var setting = {
    API_PATHS: {
        products: '/api/products',
        customers: '/api/customers'
    }
}

var Dashboard = function (plate) {
    var $plate = $(plate);
    var me = this;
    this.checkout;
    this.customers = [];
    this.products = [];
    
    var $loadBar = $plate.find('.loading--bar');
    var $bookingForm = $plate.find('.booking--form');
    this.showLoadingBar = function () {
        $loadBar.show();
        $bookingForm.hide();
    }
    
    this.showBookingForm = function () {
        $loadBar.hide();
        $bookingForm.show();
    }
    
    this.load = function (callback) {
        me.showLoadingBar();
        $.when($.getJSON(setting.API_PATHS.customers), $.getJSON(setting.API_PATHS.products)).then(function (r1, r2) {
            
            while(me.customers.length > 0) me.customers.pop();
            while(me.products.length > 0) me.products.pop();
            
            r1[0].forEach(function (customer) {
                me.customers.push(customer);
            });

            r2[0].forEach(function (product) {
                me.products.push(product);
            });
            me.checkout = new Checkout(me.products);
            
            if(callback) callback();
        });
        
    }
    
    var bindCustomerSelecoter = function () {
        var $customerSelector = $plate.find('.customer--selector');
        $customerSelector.empty();
        var $option = $('<option></option>');
        $option.text('No customer selected');
        $customerSelector.append($option);
        me.customers.forEach(function (customer) {
            var $option = $('<option></option>');
            $option.attr('value', customer.name);
            $option.text(customer.name);
            $customerSelector.append($option);
        });
        
        $customerSelector.on('change', function (evt) {
            evt.preventDefault();
            var customerName = $customerSelector.val();
            me.changeCustomer(customerName);
            updateTotal();
        });
    }
    
    var $total = $plate.find('.total--amount');
    var updateTotal = function () {
        $total.text(me.checkout.total());
    }
    
    var renderProductRows = function () {
        var $sample = $plate.find('.sample--product--row');
        me.products.forEach(function (product) {
            var $productRow = $sample.clone();
            $productRow.find('label').text(product.name);
            $sample.parent().append($productRow);
            $productRow.show();
            var $productNum = $productRow.find('input[type="number"]');
            $productNum.on('change', function () {
                var $this = $(this);
                me.checkout.remove(product.id);
                for(var i=0;i<$this.val();i++) {
                    me.checkout.add(product.id);
                }
                updateTotal();
            });
        });
    }
    
    this.render = function () {
        bindCustomerSelecoter();
        renderProductRows();
        me.showBookingForm();
    }
    
    this.start = function () {
        this.load(function () {
            me.render();
        });
    }
    
    this.changeCustomer = function (customerName) {
        var customer = this.customers.find(function (customer) {
            return customer.name === customerName;
        });
        if(customer) {
            this.checkout.setDiscount(customer.prices);
        } else {
            this.checkout.setDiscount(undefined);
        }  
         
    }
    
}