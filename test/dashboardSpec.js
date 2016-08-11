describe('Dashboard spec', function () {
    
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
    
    var dummyProducts = [classic, standout, premium];

    var unilever = {
        name: "Unilever",
        prices: {
            classic: {
                qty: 3,
                price: classic.price * 2
            }
        }
    };
    
    var apple = {
        name: "Apple",
        prices: {
            standout: {
                price: 299.99
            }
        }
    };
    var dummyCustomers = [unilever, apple];
    
    beforeEach(function () {
        spyOn($, 'when').and.returnValue({
            then: function (callback) {
                callback([dummyCustomers], [dummyProducts]);
            }
        });
        spyOn($, 'getJSON');
    });
    
    it('Make sure loading bar is showing while loading and hide after loaded', function () {
       var dashboard = new Dashboard();
        spyOn(dashboard, 'showLoadingBar');
        spyOn(dashboard, 'showBookingForm');
        dashboard.load();
        expect(dashboard.showLoadingBar).toHaveBeenCalled();
        expect(dashboard.showBookingForm).not.toHaveBeenCalled();
        dashboard.render();
        expect(dashboard.showBookingForm).toHaveBeenCalled();
    });
    
    it('Make sure it will load when dashboard is starting', function () {
       var dashboard = new Dashboard();
       spyOn(dashboard, 'load');
       dashboard.start();
       expect(dashboard.load).toHaveBeenCalled();
    });
    
    it('Make sure API is called and customers and products will be downloaded and stored', function () {
        
        var dashboard = new Dashboard();
        dashboard.load();
        
        expect($.getJSON).toHaveBeenCalledTimes(2);
        expect($.getJSON).toHaveBeenCalledWith(setting.API_PATHS.customers);
        expect($.getJSON).toHaveBeenCalledWith(setting.API_PATHS.products);
        
        expect(dashboard.products).toEqual(dummyProducts);
        expect(dashboard.customers).toEqual(dummyCustomers);
        
    });
    
    it('Make sure product list is set to Checkout after product loaded', function () {
        
        spyOn(window, 'Checkout');
        var dashboard = new Dashboard();
        dashboard.load();
        expect(window.Checkout).toHaveBeenCalledWith(dummyProducts);
        
    });
    
    it('Make sure customer set to checkout when dashboard is called to change customer', function () {
        
        var dashboard = new Dashboard();
        dashboard.load();
        var checkout = dashboard.checkout; 
        spyOn(checkout, 'setDiscount'); 
        
        dashboard.changeCustomer('Unilever');
        expect(checkout.setDiscount).toHaveBeenCalledWith(unilever.prices);

        dashboard.changeCustomer('Apple');
        expect(checkout.setDiscount).toHaveBeenCalledWith(apple.prices);
        
    });
    
    
});