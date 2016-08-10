describe('Checkout spec', function () {
    var checkout;
    var defaultPrice = [
        {
            id: 'classic',
            name: 'Classic Ad',
            price: 269.99
        },
        {
            id: 'standout',
            name: 'Standout Ad',
            price: 322.99
        },
        {
            id: 'premium',
            name: 'Premium Ad',
            price: 394.99
        }
    ];
    beforeEach(function () {
        checkout = new Checkout(defaultPrice);
    });
    
    it('Make sure item can be added to cart properly', function () {
        expect(checkout.total()).toEqual(0);
        checkout.add(defaultPrice[0].id);
        checkout.add(defaultPrice[1].id);
        checkout.add(defaultPrice[2].id);
        var expectTotal = defaultPrice[0].price;
        expectTotal += defaultPrice[1].price;
        expectTotal += defaultPrice[2].price;
        expect(checkout.total()).toEqual(expectTotal);
        checkout.add(defaultPrice[1].id);
        expect(checkout.total()).toEqual(expectTotal + defaultPrice[1].price);
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
});