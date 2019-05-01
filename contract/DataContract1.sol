contract BOLData 
{ 
    string public ShipperData;
    string public ShippingCompanyData;
    string public ShippingCompanyLoadingData;
	string public ConsigneeData;
    
    function BOLData(string Shipper_Data) 
    { 
        ShipperData = Shipper_Data;
        ShippingCompanyData = '';
        ShippingCompanyLoadingData = '';
	    ConsigneeData = '';
    } 
    function getShipperData() constant returns (string retVal) 
    { 
        return ShipperData;
    }
    function setShippingCompanyData(string ShippingCompany_Data) 
    { 
        ShippingCompanyData = ShippingCompany_Data; 
    } 
    function getShippingCompanyData() constant returns (string retVal) 
    { 
        return ShippingCompanyData;
    }
    function setShippingCompanyLoadingData(string ShippingCompanyLoading_Data) 
    { 
        ShippingCompanyLoadingData = ShippingCompanyLoading_Data; 
    } 
    function getShippingCompanyLoadingData() constant returns (string retVal) 
    { 
        return ShippingCompanyLoadingData;
    }
    function setConsigneeData(string Consignee_Data) 
    { 
        ConsigneeData = Consignee_Data; 
    } 
    function getConsigneeData() constant returns (string retVal) 
    { 
        return ConsigneeData;
    }
}