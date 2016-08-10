describe('Checkout spec', function () {
    var checkout;
    
    var classic = {
        id: 'classic',
        name: 'Classic Ad',
        price: 269.99
    }
    
    var standout = {
        id: 'standout',
        name: 'Standout Ad',
        price: 322.99
    };
    
    var premium = {
        id: 'premium',
        name: 'Premium Ad',
        price: 394.99
    }
    
    var unilever = {
        classic: {
            qty: 3,
            price: classic.price * 2
        }
    }
    
    var apple = {
        standout: {
            price: 299.99
        }
    };
    
    var nike = {
        premium: {
            minQty: 4,
            price: 379.99
        }
    }
    
    var ford = {
        classic: {
            qty: 5,
            price: classic.price * 4
        },
        standout: {
            price: 309.99
        },
        premium: {
            minQty: 3,
            price: 389.99
        }
    }
    
    var defaultPrice = [classic,standout,premium];
    beforeEach(function () {
        checkout = new Checkout(defaultPrice);
    });
    
    it('Make sure item can be added to cart properly', function () {
        expect(checkout.total()).toEqual(0);
        checkout.add(classic.id);
        checkout.add(standout.id);
        checkout.add(defaultPrice[2].id);
        var expectTotal = classic.price;
        expectTotal += standout.price;
        expectTotal += premium.price;
        expect(checkout.total()).toEqual(expectTotal);
        checkout.add(standout.id);
        expect(checkout.total()).toEqual(expectTotal + standout.price);
    });
    
    it('Error need to be raise while product is not found', function () {
        var addProductNotFound = function () {
            checkout.add('NotFound');
        }
        expect(addProductNotFound).toThrowError('Product not found');
    });
    
    it('Make sure the product can be removed', function () {
        checkout.add(defaultPrice[0].id);
        expect(checkout.total()).toEqual(defaultPrice[0].price);
        checkout.remove(defaultPrice[0].id);
        expect(checkout.total()).toEqual(0);
    });
    
    it('Test on Unilever', function () {
        checkout.setDiscount(unilever);
        checkout.add(classic.id);
        checkout.add(classic.id);
        checkout.add(classic.id);
        checkout.add(premium.id);
        var expectTotal = unilever.classic.price + premium.price;
        expect(checkout.total()).toEqual(expectTotal);
    });
    
    it('Test on Apple', function () {
        checkout.setDiscount(apple);
        checkout.add(standout.id);
        checkout.add(standout.id);
        checkout.add(standout.id);
        checkout.add(premium.id);
        var expectTotal = apple.standout.price * 3;
        expectTotal += premium.price;
        expect(checkout.total()).toEqual(expectTotal);
    });
    
    it('Test on Nike', function () {
        checkout.setDiscount(nike);
        checkout.add(premium.id);
        checkout.add(premium.id);
        checkout.add(premium.id);
        checkout.add(premium.id);
        var expectTotal = nike.premium.price * 4;
        expect(checkout.total()).toEqual(expectTotal);
    });
    
    it('Test on Ford', function () {
        checkout.setDiscount(ford);
        
        checkout.add(classic.id);
        checkout.add(classic.id);
        checkout.add(classic.id);
        checkout.add(classic.id);
        var expectTotal = classic.price * 4;
        expect(checkout.total()).toEqual(expectTotal);
        checkout.add(classic.id);
        expect(checkout.total()).toEqual(expectTotal);
        checkout.add(classic.id);
        expectTotal += classic.price;
        expect(checkout.total()).toEqual(expectTotal);
        checkout.remove(classic.id);
        
        checkout.add(standout.id);
        expect(checkout.total()).toEqual(ford.standout.price);
        expect(checkout.total()).not.toEqual(standout.price);
        checkout.remove(standout.id);
        
        checkout.add(premium.id);
        checkout.add(premium.id);
        expectTotal = premium.price * 2;
        expect(checkout.total()).toEqual(expectTotal);
        checkout.add(premium.id);
        expectTotal = ford.premium.price * 3;
        expect(checkout.total()).toEqual(expectTotal);
        checkout.add(premium.id);
        expectTotal = ford.premium.price * 4;
        expect(checkout.total()).toEqual(expectTotal);
        checkout.remove(premium.id);
        
        for(var i=0;i<5;i++) checkout.add(classic.id);
        expectTotal = classic.price * 4;
        checkout.add(standout.id);
        expectTotal += ford.standout.price;
        for(var i=0;i<3;i++) checkout.add(premium.id);
        expectTotal += ford.premium.price * 3;
        expect(checkout.total()).toEqual(expectTotal);
    });
    
});