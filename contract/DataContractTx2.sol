contract SandLTx2Data 
{ 
    string public Tranactiosn2Data;
    string public Tranactiosn2Temprature;
    string public TempratureBreached;
    
    function SandLTx2Data(string Tranactiosn2_Data) 
    { 
        Tranactiosn2Data = Tranactiosn2_Data;
        Tranactiosn2Temprature = '';
        TempratureBreached = '';
    } 
    function getTranactiosn2Data() constant returns (string retVal) 
    { 
        return Tranactiosn2Data;
    }
    function setTranactiosn2Temprature(string Tranactiosn2Temprature_Data) 
    { 
        Tranactiosn2Temprature = Tranactiosn2Temprature_Data; 
    } 
    function getTranactiosn2Temprature() constant returns (string retVal) 
    { 
        return Tranactiosn2Temprature;
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