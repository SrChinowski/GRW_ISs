using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntityLib
{
    public class OperationResult
    {
        public bool Success { get; set; }        
        public string ErrMessage { get; set; }  
        public List<Entity> RetVal { get; set; }
        public int returnedId { get; set; }

        public OperationResult()
        {
            RetVal = new List<Entity>();
        }
    }
}
