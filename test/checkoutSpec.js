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
        checkout.add(defaultPrice[0].id);
        checkout.add(defaultPrice[1].id);
        checkout.add(defaultPrice[2].id);
        expect(checkout.total()).toEqual(defaultPrice[0].price + defaultPrice[1].price + defaultPrice[2].price);
    });
});