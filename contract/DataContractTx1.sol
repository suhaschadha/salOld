contract SandLTx1Data 
{ 
    string public Tranactiosn1Data;
    string public Tranactiosn1Temprature;
    string public TempratureBreached;
    
    function SandLTx1Data(string Tranactiosn1_Data) 
    { 
        Tranactiosn1Data = Tranactiosn1_Data;
        Tranactiosn1Temprature = '';
        TempratureBreached = '';
    } 
    function getTranactiosn1Data() constant returns (string retVal) 
    { 
        return Tranactiosn1Data;
    }
    function setTranactiosn1Temprature(string Tranactiosn1Temprature_Data) 
    { 
        Tranactiosn1Temprature = Tranactiosn1Temprature_Data; 
    } 
    function getTranactiosn1Temprature() constant returns (string retVal) 
    { 
        return Tranactiosn1Temprature;
    }
    function setTempratureBreached(string TempratureBreached_Data) 
    { 
        TempratureBreached = TempratureBreached_Data; 
    } 
    function getTempratureBreached() constant returns (string retVal) 
    { 
        return TempratureBreached;
    }
}