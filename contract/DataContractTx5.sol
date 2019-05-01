contract SandLTx5Data 
{ 
    string public Tranactiosn5Data;
    string public Tranactiosn5Temprature;
    string public TempratureBreached;
    
    function SandLTx5Data(string Tranactiosn5_Data) 
    { 
        Tranactiosn5Data = Tranactiosn5_Data;
        Tranactiosn5Temprature = '';
        TempratureBreached = '';
    } 
    function getTranactiosn5Data() constant returns (string retVal) 
    { 
        return Tranactiosn5Data;
    }
    function setTranactiosn5Temprature(string Tranactiosn5Temprature_Data) 
    { 
        Tranactiosn5Temprature = Tranactiosn5Temprature_Data; 
    } 
    function getTranactiosn5Temprature() constant returns (string retVal) 
    { 
        return Tranactiosn5Temprature;
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