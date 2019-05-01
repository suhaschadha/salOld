contract SandLTx3Data 
{ 
    string public Tranactiosn3Data;
    string public Tranactiosn3Temprature;
    string public TempratureBreached;
    
    function SandLTx3Data(string Tranactiosn3_Data) 
    { 
        Tranactiosn3Data = Tranactiosn3_Data;
        Tranactiosn3Temprature = '';
        TempratureBreached = '';
    } 
    function getTranactiosn3Data() constant returns (string retVal) 
    { 
        return Tranactiosn3Data;
    }
    function setTranactiosn3Temprature(string Tranactiosn3Temprature_Data) 
    { 
        Tranactiosn3Temprature = Tranactiosn3Temprature_Data; 
    } 
    function getTranactiosn3Temprature() constant returns (string retVal) 
    { 
        return Tranactiosn3Temprature;
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