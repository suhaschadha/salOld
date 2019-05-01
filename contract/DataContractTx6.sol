contract SandLTx6Data 
{ 
    string public Tranactiosn6Data;
    string public Tranactiosn6Temprature;
    string public TempratureBreached;
    
    function SandLTx6Data(string Tranactiosn6_Data) 
    { 
        Tranactiosn6Data = Tranactiosn6_Data;
        Tranactiosn6Temprature = '';
        TempratureBreached = '';
    } 
    function getTranactiosn6Data() constant returns (string retVal) 
    { 
        return Tranactiosn6Data;
    }
    function setTranactiosn6Temprature(string Tranactiosn6Temprature_Data) 
    { 
        Tranactiosn6Temprature = Tranactiosn6Temprature_Data; 
    } 
    function getTranactiosn6Temprature() constant returns (string retVal) 
    { 
        return Tranactiosn6Temprature;
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