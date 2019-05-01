contract SandLTx4Data 
{ 
    string public Tranactiosn4Data;
    string public Tranactiosn4Temprature;
    string public TempratureBreached;
    
    function SandLTx4Data(string Tranactiosn4_Data) 
    { 
        Tranactiosn4Data = Tranactiosn4_Data;
        Tranactiosn4Temprature = '';
        TempratureBreached = '';
    } 
    function getTranactiosn4Data() constant returns (string retVal) 
    { 
        return Tranactiosn4Data;
    }
    function setTranactiosn4Temprature(string Tranactiosn4Temprature_Data) 
    { 
        Tranactiosn4Temprature = Tranactiosn4Temprature_Data; 
    } 
    function getTranactiosn4Temprature() constant returns (string retVal) 
    { 
        return Tranactiosn4Temprature;
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